from math import ceil

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """Python side uses snake_case, JSON side uses camelCase (accepts both on input)."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class PageParams(BaseModel):
    page: int = Field(1, ge=1)
    limit: int = Field(12, ge=1, le=100)

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.limit


class Page[T](CamelModel):
    items: list[T]
    total: int
    page: int
    limit: int
    pages: int

    @classmethod
    def build(cls, items: list, total: int, params: PageParams) -> "Page[T]":
        return cls(
            items=items,
            total=total,
            page=params.page,
            limit=params.limit,
            pages=ceil(total / params.limit) if total else 0,
        )
