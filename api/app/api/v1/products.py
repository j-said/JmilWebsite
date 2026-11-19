from typing import Annotated

from fastapi import APIRouter, Query, Response

from app.api.deps import SessionDep
from app.core.cache import cache_aside, make_key
from app.core.redis import RedisDep
from app.schemas.common import Page
from app.schemas.product import ProductFacets, ProductQuery, ProductRead
from app.services import products as product_service

router = APIRouter(prefix="/products", tags=["products"])

PRODUCTS_CACHE = "products:list"


@router.get("", response_model=Page[ProductRead])
async def list_products(
    query: Annotated[ProductQuery, Query()], session: SessionDep, redis: RedisDep
):
    """Catalog with pagination, search, sorting and filters.

    List filters repeat the parameter: `?brand=DJI&brand=Autel%20Robotics`.

    Cached in Redis; the `X-Cache` header is HIT, MISS or BYPASS.
    """

    async def load() -> str:
        products, total = await product_service.list_products(session, query)
        return Page[ProductRead].build(products, total, query).model_dump_json(by_alias=True)

    key = make_key(PRODUCTS_CACHE, query.model_dump_json())
    body, status = await cache_aside(redis, key, load)
    return Response(body, media_type="application/json", headers={"X-Cache": status})


@router.get("/facets", response_model=ProductFacets)
async def get_facets(session: SessionDep):
    """Values available for the catalog filters."""
    return await product_service.get_facets(session)


@router.get("/{product_id}", response_model=ProductRead, responses={404: {}})
async def get_product(product_id: int, session: SessionDep):
    return await product_service.get_product(session, product_id)
