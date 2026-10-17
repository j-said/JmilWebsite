from enum import StrEnum

from pydantic import BaseModel, Field, model_validator

from app.schemas.common import CamelModel, PageParams


class ProductSort(StrEnum):
    NAME = "name"
    NAME_DESC = "name-desc"
    PRICE = "price"
    PRICE_DESC = "price-desc"
    RATING = "rating"
    NEWEST = "newest"
    POPULAR = "popular"


class ProductQuery(PageParams):
    """Query-string model for GET /products (FastAPI expands it into separate params)."""

    search: str | None = Field(None, max_length=100)
    category: list[str] = []
    brand: list[str] = []
    feature: list[str] = []
    min_price: float | None = Field(None, ge=0, alias="minPrice")
    max_price: float | None = Field(None, ge=0, alias="maxPrice")
    in_stock: bool | None = Field(None, alias="inStock")
    sort: ProductSort = ProductSort.NAME

    @model_validator(mode="after")
    def _check_price_range(self) -> "ProductQuery":
        if (
            self.min_price is not None
            and self.max_price is not None
            and self.min_price > self.max_price
        ):
            raise ValueError("minPrice must not be greater than maxPrice")
        return self


class ProductRead(CamelModel):
    id: int
    name: str
    description: str | None
    price: float
    original_price: float | None
    on_sale: bool
    rating: float | None
    review_count: int
    category: str
    brand: str
    features: list[str]
    in_stock: bool
    image_url: str | None
    images: list[str]


class PriceRange(BaseModel):
    min: float
    max: float


class ProductFacets(CamelModel):
    categories: list[str]
    brands: list[str]
    features: list[str]
    price_range: PriceRange
