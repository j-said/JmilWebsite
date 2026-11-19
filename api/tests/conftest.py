"""Integration tests run against a real PostgreSQL database `<DB_NAME>_test`.

The schema is created once per session. Every test runs inside an outer
transaction that is rolled back afterwards; `create_savepoint` mode turns the
services' own `commit()` calls into savepoints, so tests stay isolated.
Redis: `TEST_REDIS_URL` (db 15 by default), flushed before every test.
"""

import os
from collections.abc import AsyncIterator

import asyncpg
import pytest
from httpx import ASGITransport, AsyncClient
from redis.asyncio import Redis
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

import app.models  # noqa: F401
from app.core.config import settings
from app.core.database import Base, get_session
from app.core.redis import get_redis
from app.main import app
from app.models import Product

TEST_URL = make_url(settings.database_url).set(
    database=f"{make_url(settings.database_url).database}_test"
)


async def _ensure_database() -> None:
    conn = await asyncpg.connect(
        user=TEST_URL.username,
        password=TEST_URL.password,
        host=TEST_URL.host,
        port=TEST_URL.port,
        database="postgres",
    )
    try:
        exists = await conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = $1", TEST_URL.database
        )
        if not exists:
            await conn.execute(f'CREATE DATABASE "{TEST_URL.database}"')
    finally:
        await conn.close()


@pytest.fixture(scope="session")
async def engine():
    await _ensure_database()
    engine = create_async_engine(TEST_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest.fixture
async def session(engine) -> AsyncIterator[AsyncSession]:
    async with engine.connect() as conn:
        trans = await conn.begin()
        session = AsyncSession(
            bind=conn, expire_on_commit=False, join_transaction_mode="create_savepoint"
        )
        try:
            yield session
        finally:
            await session.close()
            await trans.rollback()


TEST_REDIS_URL = os.environ.get("TEST_REDIS_URL", "redis://localhost:6379/15")


@pytest.fixture
async def redis() -> AsyncIterator[Redis]:
    client = Redis.from_url(TEST_REDIS_URL, decode_responses=True)
    await client.flushdb()
    yield client
    await client.aclose()


@pytest.fixture
async def client(session, redis) -> AsyncIterator[AsyncClient]:
    app.dependency_overrides[get_session] = lambda: session
    app.dependency_overrides[get_redis] = lambda: redis
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest.fixture
async def products(session) -> list[Product]:
    items = [
        Product(
            name="Alpha Drone", price=100, category="Camera", brand="DJI", features=["GPS", "4K"]
        ),
        Product(
            name="Beta Racer",
            price=300,
            original_price=400,
            category="FPV",
            brand="iFlight",
            features=["GPS"],
        ),
        Product(
            name="Gamma Kit",
            price=50,
            category="Camera",
            brand="Generic",
            features=[],
            in_stock=False,
        ),
    ]
    session.add_all(items)
    await session.commit()
    return items


async def register_and_login(client: AsyncClient, email: str) -> dict[str, str]:
    """Register a user and return its Authorization header."""
    await client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "secret123", "firstName": "Ann", "lastName": "Pilot"},
    )
    resp = await client.post(
        "/api/v1/auth/login", data={"username": email, "password": "secret123"}
    )
    return {"Authorization": f"Bearer {resp.json()['access_token']}"}


@pytest.fixture
async def auth_headers(client) -> dict[str, str]:
    return await register_and_login(client, "pilot@test.dev")
