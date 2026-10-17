from fastapi import APIRouter, Response, status

from app.api.deps import CurrentUser, PageDep, SessionDep
from app.schemas.common import Page
from app.schemas.order import OrderCreate, OrderRead
from app.services import orders as order_service

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post(
    "",
    response_model=OrderRead,
    status_code=status.HTTP_201_CREATED,
    responses={422: {"description": "Unknown or out-of-stock products"}},
)
async def create_order(
    data: OrderCreate, user: CurrentUser, session: SessionDep, response: Response
):
    order = await order_service.create_order(session, user, data)
    response.headers["Location"] = f"/api/v1/orders/{order.id}"
    return order


@router.get("", response_model=Page[OrderRead])
async def list_my_orders(user: CurrentUser, session: SessionDep, page: PageDep):
    """Orders of the current user, newest first."""
    orders, total = await order_service.list_user_orders(session, user, page)
    return Page.build(orders, total, page)


@router.get("/{order_id}", response_model=OrderRead, responses={404: {}})
async def get_my_order(order_id: int, user: CurrentUser, session: SessionDep):
    return await order_service.get_user_order(session, user, order_id)
