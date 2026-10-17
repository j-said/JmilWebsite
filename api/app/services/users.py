from anyio import to_thread
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AuthenticationError, ConflictError
from app.core.security import hash_password, verify_password
from app.models import User
from app.schemas.user import UserCreate, UserUpdate


# Password hashing is CPU-bound (Argon2); running it in a worker thread keeps the
# event loop free to serve other requests meanwhile.
async def _hash(password: str) -> str:
    return await to_thread.run_sync(hash_password, password)


async def _verify(password: str, hashed: str) -> bool:
    return await to_thread.run_sync(verify_password, password, hashed)


# Verifying against a real hash even for unknown emails keeps login timing uniform,
# so response time does not reveal which emails are registered.
_DUMMY_HASH = hash_password("dummy-password-for-timing")


async def get_by_id(session: AsyncSession, user_id: int) -> User | None:
    return await session.get(User, user_id)


async def get_by_email(session: AsyncSession, email: str) -> User | None:
    return await session.scalar(select(User).where(User.email == email.lower()))


async def register(session: AsyncSession, data: UserCreate) -> User:
    user = User(
        email=data.email.lower(),
        password_hash=await _hash(data.password),
        first_name=data.first_name,
        last_name=data.last_name,
        phone=data.phone,
    )
    session.add(user)
    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise ConflictError("Email is already registered") from None
    await session.refresh(user)
    return user


async def authenticate(session: AsyncSession, email: str, password: str) -> User:
    user = await get_by_email(session, email)
    if user is None:
        await _verify(password, _DUMMY_HASH)
        raise AuthenticationError("Incorrect email or password")
    if not await _verify(password, user.password_hash):
        raise AuthenticationError("Incorrect email or password")
    return user


async def update_profile(session: AsyncSession, user: User, data: UserUpdate) -> User:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    await session.commit()
    await session.refresh(user)
    return user
