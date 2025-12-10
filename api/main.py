import logging
import time
from fastapi import FastAPI, Depends, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

import database
import schemas
import crud
from config import settings

logging.basicConfig(
    level=settings.LOG_LEVEL, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("api")

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    logger.info(f"Incoming: {request.method} {request.url}")
    try:
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000
        logger.info(f"Done: {response.status_code} | {process_time:.2f}ms")
        return response
    except Exception as e:
        logger.error(f"Failed: {e}", exc_info=True)
        raise e


@app.get("/api/products/filters", response_model=schemas.FilterResponse)
async def get_filters(db: AsyncSession = Depends(database.get_db)):
    return await crud.get_filters_data(db)


@app.get("/api/products", response_model=schemas.PaginatedProducts)
async def get_products(
    page: int = 1,
    limit: int = 12,
    sort: str = "name",
    search: str = "",
    minPrice: Optional[float] = None,
    maxPrice: Optional[float] = None,
    category: List[str] = Query(None),
    categories: List[str] = Query(None),
    brand: List[str] = Query(None),
    brands: List[str] = Query(None),
    features: List[str] = Query(None),
    db: AsyncSession = Depends(database.get_db),
):
    cats = categories or category
    brnds = brands or brand
    products, total = await crud.get_products_list(
        db, page, limit, sort, search, minPrice, maxPrice, cats, brnds, features
    )
    return {"products": products, "total": total, "page": page, "limit": limit}


@app.get("/api/products/{id}", response_model=schemas.ProductSchema)
async def get_product(id: int, db: AsyncSession = Depends(database.get_db)):
    product = await crud.get_product_by_id(db, id)
    if not product:
        raise HTTPException(status_code=404, detail="Not found")
    return product


@app.get("/api/news", response_model=schemas.NewsResponse)
async def get_news(
    limit: int = 5, offset: int = 0, db: AsyncSession = Depends(database.get_db)
):
    posts, total = await crud.get_news_list(db, limit, offset)
    return {
        "data": posts,
        "pagination": {"total": total, "limit": limit, "offset": offset},
    }
