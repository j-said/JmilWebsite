from typing import Annotated

from fastapi import APIRouter, Query

from app.api.deps import SessionDep
from app.schemas.common import Page
from app.schemas.product import ProductFacets, ProductQuery, ProductRead
from app.services import products as product_service

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=Page[ProductRead])
async def list_products(query: Annotated[ProductQuery, Query()], session: SessionDep):
    """Catalog with pagination, search, sorting and filters.

    List filters repeat the parameter: `?brand=DJI&brand=Autel%20Robotics`.
    """
    products, total = await product_service.list_products(session, query)
    return Page.build(products, total, query)


@router.get("/facets", response_model=ProductFacets)
async def get_facets(session: SessionDep):
    """Values available for the catalog filters."""
    return await product_service.get_facets(session)


@router.get("/{product_id}", response_model=ProductRead, responses={404: {}})
async def get_product(product_id: int, session: SessionDep):
    return await product_service.get_product(session, product_id)
