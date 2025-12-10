from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
from datetime import datetime


class ProductSchema(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    originalPrice: Optional[float] = Field(None, validation_alias="original_price")
    onSale: bool = Field(..., validation_alias="on_sale")
    rating: Optional[float] = None
    reviewCount: int = Field(0, validation_alias="review_count")
    category: Optional[str] = None
    brand: Optional[str] = None
    features: List[str] = []
    inStock: bool = Field(True, validation_alias="in_stock")
    imageUrl: Optional[str] = Field(None, validation_alias="image_url")
    images: Optional[List[str]] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class PaginatedProducts(BaseModel):
    products: List[ProductSchema]
    total: int
    page: int
    limit: int


class FilterResponse(BaseModel):
    brands: List[str]
    categories: List[str]
    features: List[str]
    priceRange: dict


class NewsPostSchema(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class NewsResponse(BaseModel):
    data: List[NewsPostSchema]
    pagination: dict


class CustomerBase(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    phone: str
    notes: Optional[str] = None
    terms: bool


class OrderItemBase(BaseModel):
    id: int  # Product ID
    quantity: int
    price: float


class OrderCreate(BaseModel):
    customer: CustomerBase
    items: List[OrderItemBase]
    total: float


class OrderResponse(BaseModel):
    id: int
    message: str = "Order registered successfully"
