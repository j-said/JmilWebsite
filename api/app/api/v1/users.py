from fastapi import APIRouter

from app.api.deps import CurrentUser, SessionDep
from app.schemas.user import UserRead, UserUpdate
from app.services import users as user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
async def read_me(user: CurrentUser):
    return user


@router.patch("/me", response_model=UserRead)
async def update_me(data: UserUpdate, user: CurrentUser, session: SessionDep):
    return await user_service.update_profile(session, user, data)
