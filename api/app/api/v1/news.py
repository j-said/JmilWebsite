from fastapi import APIRouter

from app.api.deps import PageDep, SessionDep
from app.schemas.common import Page
from app.schemas.news import NewsPostRead
from app.services import news as news_service

router = APIRouter(prefix="/news", tags=["news"])


@router.get("", response_model=Page[NewsPostRead])
async def list_news(session: SessionDep, page: PageDep):
    posts, total = await news_service.list_posts(session, page)
    return Page.build(posts, total, page)


@router.get("/{post_id}", response_model=NewsPostRead, responses={404: {}})
async def get_news_post(post_id: int, session: SessionDep):
    return await news_service.get_post(session, post_id)
