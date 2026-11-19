"""Async orders: the queue message and its status in Redis (24 h): queued -> completed | failed."""

import json
import uuid

from redis.asyncio import Redis

from app.core import queue
from app.core.config import settings
from app.core.exceptions import NotFoundError
from app.models import User
from app.schemas.order import OrderCreate, OrderRequestStatus


def _key(request_id: str) -> str:
    return f"order-request:{request_id}"


async def save(
    redis: Redis,
    request_id: str,
    user_id: int,
    status: OrderRequestStatus,
    order_id: int | None = None,
    error: str | None = None,
) -> dict:
    record = {
        "request_id": request_id,
        "user_id": user_id,
        "status": status,
        "order_id": order_id,
        "error": error,
    }
    await redis.set(_key(request_id), json.dumps(record), ex=settings.IDEMPOTENCY_TTL_SECONDS)
    return record


async def submit(redis: Redis, user: User, data: OrderCreate) -> dict:
    """Save the request as queued and send it to the worker."""
    request_id = str(uuid.uuid4())
    record = await save(redis, request_id, user.id, OrderRequestStatus.QUEUED)
    await queue.send_message(
        {"requestId": request_id, "userId": user.id, "order": data.model_dump(mode="json")}
    )
    return record


async def get_for_user(redis: Redis, request_id: str, user_id: int) -> dict:
    raw = await redis.get(_key(request_id))
    record = json.loads(raw) if raw else None
    if record is None or record["user_id"] != user_id:
        raise NotFoundError(f"Order request {request_id} not found")
    return record
