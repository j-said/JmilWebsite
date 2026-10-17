from decimal import Decimal

from sqlalchemy import CheckConstraint, Index, Numeric, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base, TimestampMixin


class Product(TimestampMixin, Base):
    __tablename__ = "products"
    __table_args__ = (
        CheckConstraint("price >= 0", name="price_non_negative"),
        CheckConstraint("rating IS NULL OR rating BETWEEN 0 AND 5", name="rating_range"),
        Index("ix_products_category", "category"),
        Index("ix_products_brand", "brand"),
        Index("ix_products_price", "price"),
        # GIN index makes `features @> ARRAY[...]` filtering cheap.
        Index("ix_products_features", "features", postgresql_using="gin"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    original_price: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    rating: Mapped[Decimal | None] = mapped_column(Numeric(2, 1))
    review_count: Mapped[int] = mapped_column(default=0, server_default="0")
    category: Mapped[str] = mapped_column(String(100))
    brand: Mapped[str] = mapped_column(String(100))
    features: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list, server_default="{}")
    in_stock: Mapped[bool] = mapped_column(default=True, server_default="true")
    image_url: Mapped[str | None] = mapped_column(Text)
    images: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list, server_default="{}")

    @property
    def on_sale(self) -> bool:
        # Derived instead of stored, so it can never disagree with the prices.
        return self.original_price is not None and self.original_price > self.price
