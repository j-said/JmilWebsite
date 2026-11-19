from typing import Annotated

from fastapi import APIRouter, Header, status
from redis.asyncio import Redis

from app.api.deps import CurrentUser, PageDep, SessionDep
from app.core import queue
from app.core.exceptions import ServiceUnavailableError
from app.core.idempotency import StoredResponse, run_idempotent
from app.core.redis import RedisDep
from app.schemas.common import Page
from app.schemas.order import OrderCreate, OrderRead, OrderRequestRead
from app.services import order_requests
from app.services import orders as order_service

router = APIRouter(prefix="/orders", tags=["orders"])

IdempotencyKey = Annotated[
    str | None,
    Header(
        alias="Idempotency-Key",
        min_length=8,
        max_length=128,
        description="Client-generated unique key (e.g. a UUID). Repeats return the "
        "stored response for 24 h instead of executing again.",
    ),
]


@router.post(
    "",
    response_model=OrderRead,
    status_code=status.HTTP_201_CREATED,
    responses={
        409: {"description": "A request with the same Idempotency-Key is still running"},
        422: {"description": "Unknown/out-of-stock products, or Idempotency-Key reused"},
    },
)
async def create_order(
    data: OrderCreate,
    user: CurrentUser,
    session: SessionDep,
    redis: RedisDep,
    idempotency_key: IdempotencyKey = None,
):
    async def execute() -> StoredResponse:
        order = await order_service.create_order(session, user, data)
        body = OrderRead.model_validate(order).model_dump_json(by_alias=True)
        return StoredResponse(201, body, {"Location": f"/api/v1/orders/{order.id}"})

    return await run_idempotent(
        redis,
        scope=f"orders:{user.id}",
        key=idempotency_key,
        payload=data.model_dump_json(),
        handler=execute,
    )


def _require_redis(redis: Redis | None) -> Redis:
    if redis is None:
        raise ServiceUnavailableError("Asynchronous orders are not configured")
    return redis


@router.post(
    "/async",
    response_model=OrderRequestRead,
    status_code=status.HTTP_202_ACCEPTED,
    responses={503: {"description": "Queue is not configured"}},
)
async def create_order_async(
    data: OrderCreate,
    user: CurrentUser,
    redis: RedisDep,
    idempotency_key: IdempotencyKey = None,
):
    """Queue the order and answer 202 right away.

    `Location` points to the request status: `queued`, then `completed` or `failed`.
    """
    if not queue.is_enabled():
        raise ServiceUnavailableError("Asynchronous orders are not configured")
    redis = _require_redis(redis)

    async def enqueue() -> StoredResponse:
        record = await order_requests.submit(redis, user, data)
        body = OrderRequestRead.model_validate(record).model_dump_json(by_alias=True)
        location = f"/api/v1/orders/requests/{record['request_id']}"
        return StoredResponse(202, body, {"Location": location})

    return await run_idempotent(
        redis,
        scope=f"orders-async:{user.id}",
        key=idempotency_key,
        payload=data.model_dump_json(),
        handler=enqueue,
    )


@router.get("/requests/{request_id}", response_model=OrderRequestRead, responses={404: {}})
async def get_order_request(request_id: str, user: CurrentUser, redis: RedisDep):
    """Status of an order accepted by `POST /orders/async`."""
    return await order_requests.get_for_user(_require_redis(redis), request_id, user.id)


@router.get("", response_model=Page[OrderRead])
async def list_my_orders(user: CurrentUser, session: SessionDep, page: PageDep):
    """Orders of the current user, newest first."""
    orders, total = await order_service.list_user_orders(session, user, page)
    return Page.build(orders, total, page)


@router.get("/{order_id}", response_model=OrderRead, responses={404: {}})
async def get_my_order(order_id: int, user: CurrentUser, session: SessionDep):
    return await order_service.get_user_order(session, user, order_id)
