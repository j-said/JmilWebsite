import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, desc, asc
from typing import List, Optional
import database

logger = logging.getLogger("crud")


async def get_filters_data(db: AsyncSession):
    brands = (
        (
            await db.execute(
                select(database.Product.brand)
                .distinct()
                .order_by(database.Product.brand)
            )
        )
        .scalars()
        .all()
    )
    categories = (
        (
            await db.execute(
                select(database.Product.category)
                .distinct()
                .order_by(database.Product.category)
            )
        )
        .scalars()
        .all()
    )
    min_price, max_price = (
        await db.execute(
            select(func.min(database.Product.price), func.max(database.Product.price))
        )
    ).one()
    features = (
        (await db.execute(select(func.unnest(database.Product.features)).distinct()))
        .scalars()
        .all()
    )

    return {
        "brands": [b for b in brands if b],
        "categories": [c for c in categories if c],
        "features": sorted([f for f in features if f]),
        "priceRange": {"min": float(min_price or 0), "max": float(max_price or 0)},
    }


async def get_products_list(
    db: AsyncSession,
    page: int,
    limit: int,
    sort: str,
    search: str,
    min_price: Optional[float],
    max_price: Optional[float],
    categories: List[str],
    brands: List[str],
    features: List[str],
):
    query = select(database.Product)

    if search:
        st = f"%{search}%"
        query = query.filter(
            or_(database.Product.name.ilike(st), database.Product.description.ilike(st))
        )
    if categories:
        query = query.filter(database.Product.category.in_(categories))
    if brands:
        query = query.filter(database.Product.brand.in_(brands))
    if min_price is not None:
        query = query.filter(database.Product.price >= min_price)
    if max_price is not None:
        query = query.filter(database.Product.price <= max_price)
    if features:
        query = query.filter(database.Product.features.contains(features))

    sort_map = {
        "name-desc": desc(database.Product.name),
        "price": asc(database.Product.price),
        "price-desc": desc(database.Product.price),
        "rating": desc(database.Product.rating),
        "newest": desc(database.Product.created_at),
    }
    query = query.order_by(sort_map.get(sort, asc(database.Product.name)))

    total = (
        await db.execute(select(func.count()).select_from(query.subquery()))
    ).scalar()

    offset = (page - 1) * limit
    products = (await db.execute(query.offset(offset).limit(limit))).scalars().all()

    return products, total


async def get_product_by_id(db: AsyncSession, product_id: int):
    result = await db.execute(
        select(database.Product).filter(database.Product.id == product_id)
    )
    return result.scalar_one_or_none()


async def get_news_list(db: AsyncSession, limit: int, offset: int):
    total = (
        await db.execute(select(func.count()).select_from(database.NewsPost))
    ).scalar()
    query = (
        select(database.NewsPost)
        .order_by(desc(database.NewsPost.created_at))
        .offset(offset)
        .limit(limit)
    )
    posts = (await db.execute(query)).scalars().all()
    return posts, total
