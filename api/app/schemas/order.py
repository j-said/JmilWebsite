from datetime import datetime

from pydantic import Field

from app.models.order import OrderStatus
from app.schemas.common import CamelModel
from app.schemas.user import Name, Phone


class OrderItemCreate(CamelModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(gt=0, le=99)


class OrderCreate(CamelModel):
    """Only product ids and quantities come from the client — prices are taken from the DB."""

    first_name: Name
    last_name: Name
    phone: Phone
    notes: str | None = Field(None, max_length=1000)
    items: list[OrderItemCreate] = Field(min_length=1, max_length=50)


class OrderItemRead(CamelModel):
    product_id: int
    product_name: str
    image_url: str | None
    quantity: int
    unit_price: float
    subtotal: float


class OrderRead(CamelModel):
    id: int
    status: OrderStatus
    total: float
    first_name: str
    last_name: str
    phone: str
    notes: str | None
    created_at: datetime
    items: list[OrderItemRead]
