"""Queue worker: creates orders accepted by POST /orders/async.

Run: python -m app.worker

SQS can deliver a message more than once, so orders.request_id is unique and
a repeated message reuses the existing order.
"""

import asyncio
import json
import logging
import signal
from typing import Any

from pydantic import ValidationError as PydanticValidationError
from redis.asyncio import Redis
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import queue
from app.core.config import settings
from app.core.database import SessionFactory, engine
from app.core.exceptions import ValidationError
from app.core.logging import setup_logging
from app.core.redis import close_redis, get_redis
from app.schemas.order import OrderCreate, OrderRequestStatus
from app.services import order_requests
from app.services import orders as order_service
from app.services import users as user_service

logger = logging.getLogger("app.worker")


async def _create(session: AsyncSession, body: dict[str, Any]) -> int:
    """Create the order for this message, or return the one a previous delivery created."""
    request_id: str = body["requestId"]
    existing = await order_service.find_by_request_id(session, request_id)
    if existing is not None:
        logger.info("request %s already processed (order %s), skipping", request_id, existing)
        return existing
    # Fake slow step, like a call to a payment provider. The transaction is ended
    # first, so no DB connection is held while waiting.
    await session.rollback()
    await asyncio.sleep(settings.WORKER_PROCESSING_SECONDS)

    user = await user_service.get_by_id(session, body["userId"])
    if user is None:
        raise ValidationError("User not found")
    try:
        data = OrderCreate.model_validate(body["order"])
    except PydanticValidationError as exc:
        raise ValidationError("Invalid order payload") from exc
    try:
        order = await order_service.create_order(session, user, data, request_id=request_id)
    except IntegrityError:
        await session.rollback()
        order_id = await order_service.find_by_request_id(session, request_id)
        if order_id is None:
            raise  # not a duplicate: let SQS redeliver
        # Another copy of this message created the order first.
        return order_id
    return order.id


async def process_message(body: dict[str, Any], session: AsyncSession, redis: Redis) -> None:
    request_id, user_id = body["requestId"], body["userId"]
    try:
        order_id = await _create(session, body)
    except ValidationError as exc:
        # Retrying won't help here, so mark it failed and drop the message.
        await order_requests.save(
            redis, request_id, user_id, OrderRequestStatus.FAILED, error=exc.detail
        )
        return
    await order_requests.save(
        redis, request_id, user_id, OrderRequestStatus.COMPLETED, order_id=order_id
    )


async def _handle(message: dict[str, Any], redis: Redis) -> None:
    receive_count = message.get("Attributes", {}).get("ApproximateReceiveCount", "1")
    try:
        body = json.loads(message["Body"])
        async with SessionFactory() as session:
            await process_message(body, session, redis)
        await queue.delete_message(message["ReceiptHandle"])
        logger.info("processed %s (receive #%s)", body.get("requestId"), receive_count)
    except Exception:
        logger.exception(
            "failed to process message %s (receive #%s), it will be redelivered",
            message.get("MessageId"),
            receive_count,
        )


async def run() -> None:
    if not queue.is_enabled():
        raise SystemExit("ORDER_QUEUE_URL is not set")
    redis = get_redis()
    if redis is None:
        raise SystemExit("REDIS_URL is not set")

    stop = asyncio.Event()
    loop = asyncio.get_running_loop()
    for sig in (signal.SIGTERM, signal.SIGINT):
        loop.add_signal_handler(sig, stop.set)

    logger.info("worker started, batch=%s", settings.WORKER_BATCH_SIZE)
    while not stop.is_set():
        try:
            messages = await queue.receive_messages(settings.WORKER_BATCH_SIZE, wait_seconds=10)
        except Exception:
            logger.exception("receive failed")
            await asyncio.sleep(5)
            continue
        await asyncio.gather(*(_handle(m, redis) for m in messages))

    logger.info("SIGTERM received, current batch finished, shutting down")
    await close_redis()
    await engine.dispose()


if __name__ == "__main__":
    setup_logging(settings.LOG_LEVEL)
    asyncio.run(run())
