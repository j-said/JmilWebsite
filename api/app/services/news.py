from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models import NewsPost
from app.schemas.common import PageParams


async def list_posts(session: AsyncSession, params: PageParams) -> tuple[list[NewsPost], int]:
    total = await session.scalar(select(func.count()).select_from(NewsPost))
    stmt = (
        select(NewsPost)
        .order_by(NewsPost.created_at.desc(), NewsPost.id.desc())
        .offset(params.offset)
        .limit(params.limit)
    )
    posts = (await session.scalars(stmt)).all()
    return list(posts), total or 0


async def get_post(session: AsyncSession, post_id: int) -> NewsPost:
    post = await session.get(NewsPost, post_id)
    if post is None:
        raise NotFoundError(f"News post {post_id} not found")
    return post
