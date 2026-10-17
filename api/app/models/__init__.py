"""Importing this package registers every model on `Base.metadata` (needed by Alembic)."""

from app.models.news import NewsPost
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.models.user import User

__all__ = ["NewsPost", "Order", "OrderItem", "OrderStatus", "Product", "User"]
