from typing import Annotated

from fastapi import APIRouter, Header, status

from app.api.deps import CurrentUser, PageDep, SessionDep
from app.core.idempotency import StoredResponse, run_idempotent
from app.core.redis import RedisDep
from app.schemas.common import Page
from app.schemas.order import OrderCreate, OrderRead
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


@router.get("", response_model=Page[OrderRead])
async def list_my_orders(user: CurrentUser, session: SessionDep, page: PageDep):
    """Orders of the current user, newest first."""
    orders, total = await order_service.list_user_orders(session, user, page)
    return Page.build(orders, total, page)


@router.get("/{order_id}", response_model=OrderRead, responses={404: {}})
async def get_my_order(order_id: int, user: CurrentUser, session: SessionDep):
    return await order_service.get_user_order(session, user, order_id)
