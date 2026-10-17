import logging
from collections import Counter
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import NotFoundError, ValidationError
from app.models import Order, OrderItem, Product, User
from app.schemas.common import PageParams
from app.schemas.order import OrderCreate

logger = logging.getLogger(__name__)


async def create_order(session: AsyncSession, user: User, data: OrderCreate) -> Order:
    # Merge duplicate lines ("2x id=5" + "1x id=5" -> "3x id=5").
    quantities = Counter()
    for line in data.items:
        quantities[line.product_id] += line.quantity

    products = {
        p.id: p for p in await session.scalars(select(Product).where(Product.id.in_(quantities)))
    }
    missing = sorted(set(quantities) - set(products))
    if missing:
        raise ValidationError(f"Unknown product ids: {missing}")
    unavailable = sorted(p.name for p in products.values() if not p.in_stock)
    if unavailable:
        raise ValidationError(f"Out of stock: {', '.join(unavailable)}")

    # Prices always come from the database, never from the client.
    items = [
        OrderItem(product=products[pid], quantity=qty, unit_price=products[pid].price)
        for pid, qty in quantities.items()
    ]
    order = Order(
        user=user,
        first_name=data.first_name,
        last_name=data.last_name,
        phone=data.phone,
        notes=data.notes,
        total=sum((i.unit_price * i.quantity for i in items), Decimal(0)),
        items=items,
    )
    session.add(order)
    await session.commit()
    logger.info("Order %s created by user %s, total=%s", order.id, user.id, order.total)
    return await get_user_order(session, user, order.id)


async def list_user_orders(
    session: AsyncSession, user: User, params: PageParams
) -> tuple[list[Order], int]:
    total = await session.scalar(
        select(func.count()).select_from(Order).where(Order.user_id == user.id)
    )
    stmt = (
        select(Order)
        .where(Order.user_id == user.id)
        .options(selectinload(Order.items))
        .order_by(Order.created_at.desc(), Order.id.desc())
        .offset(params.offset)
        .limit(params.limit)
    )
    orders = (await session.scalars(stmt)).all()
    return list(orders), total or 0


async def get_user_order(session: AsyncSession, user: User, order_id: int) -> Order:
    stmt = (
        select(Order)
        .where(Order.id == order_id, Order.user_id == user.id)
        .options(selectinload(Order.items))
        .execution_options(populate_existing=True)
    )
    order = await session.scalar(stmt)
    # Someone else's order is reported as "not found", so ids can't be probed.
    if order is None:
        raise NotFoundError(f"Order {order_id} not found")
    return order
