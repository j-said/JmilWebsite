from sqlalchemy import Select, asc, desc, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models import Product
from app.schemas.product import PriceRange, ProductFacets, ProductQuery, ProductSort

_SORTING = {
    ProductSort.NAME: (asc(Product.name),),
    ProductSort.NAME_DESC: (desc(Product.name),),
    ProductSort.PRICE: (asc(Product.price),),
    ProductSort.PRICE_DESC: (desc(Product.price),),
    ProductSort.RATING: (desc(Product.rating).nulls_last(),),
    ProductSort.NEWEST: (desc(Product.created_at),),
    ProductSort.POPULAR: (desc(Product.review_count),),
}


def _apply_filters(stmt: Select, q: ProductQuery) -> Select:
    if q.search:
        # Escape LIKE wildcards so "%" or "_" in user input are matched literally.
        escaped = q.search.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        pattern = f"%{escaped}%"
        stmt = stmt.where(
            or_(
                Product.name.ilike(pattern, escape="\\"),
                Product.description.ilike(pattern, escape="\\"),
            )
        )
    if q.category:
        stmt = stmt.where(Product.category.in_(q.category))
    if q.brand:
        stmt = stmt.where(Product.brand.in_(q.brand))
    if q.feature:
        stmt = stmt.where(Product.features.contains(q.feature))
    if q.min_price is not None:
        stmt = stmt.where(Product.price >= q.min_price)
    if q.max_price is not None:
        stmt = stmt.where(Product.price <= q.max_price)
    if q.in_stock is not None:
        stmt = stmt.where(Product.in_stock.is_(q.in_stock))
    return stmt


async def list_products(session: AsyncSession, q: ProductQuery) -> tuple[list[Product], int]:
    filtered = _apply_filters(select(Product), q)
    total = await session.scalar(select(func.count()).select_from(filtered.subquery()))
    # `id` as a tie-breaker keeps pagination stable when sort keys are equal.
    stmt = filtered.order_by(*_SORTING[q.sort], Product.id).offset(q.offset).limit(q.limit)
    products = (await session.scalars(stmt)).all()
    return list(products), total or 0


async def get_product(session: AsyncSession, product_id: int) -> Product:
    product = await session.get(Product, product_id)
    if product is None:
        raise NotFoundError(f"Product {product_id} not found")
    return product


async def get_facets(session: AsyncSession) -> ProductFacets:
    categories = await session.scalars(
        select(Product.category).distinct().order_by(Product.category)
    )
    brands = await session.scalars(select(Product.brand).distinct().order_by(Product.brand))
    unnested = select(func.unnest(Product.features).label("feature")).subquery()
    features = await session.scalars(
        select(unnested.c.feature).distinct().order_by(unnested.c.feature)
    )
    min_price, max_price = (
        await session.execute(select(func.min(Product.price), func.max(Product.price)))
    ).one()
    return ProductFacets(
        categories=list(categories),
        brands=list(brands),
        features=list(features),
        price_range=PriceRange(min=float(min_price or 0), max=float(max_price or 0)),
    )
