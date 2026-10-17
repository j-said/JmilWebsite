from typing import Annotated

from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import SessionDep
from app.core.security import create_access_token
from app.schemas.user import Token, UserCreate, UserRead
from app.services import users as user_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    responses={409: {"description": "Email is already registered"}},
)
async def register(data: UserCreate, session: SessionDep):
    return await user_service.register(session, data)


@router.post("/login", response_model=Token, responses={401: {"description": "Bad credentials"}})
async def login(
    form: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep
) -> Token:
    """OAuth2 password flow: send `username` (the email) and `password` as form data."""
    user = await user_service.authenticate(session, form.username, form.password)
    token, expires_in = create_access_token(user.id)
    return Token(access_token=token, expires_in=expires_in)
