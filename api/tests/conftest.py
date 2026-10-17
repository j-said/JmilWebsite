"""Integration tests run against a real PostgreSQL database `<DB_NAME>_test`.

The schema is created once per session. Every test runs inside an outer
transaction that is rolled back afterwards; `create_savepoint` mode turns the
services' own `commit()` calls into savepoints, so tests stay isolated.
"""

from collections.abc import AsyncIterator

import asyncpg
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

import app.models  # noqa: F401
from app.core.config import settings
from app.core.database import Base, get_session
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


@pytest.fixture
async def client(session) -> AsyncIterator[AsyncClient]:
    app.dependency_overrides[get_session] = lambda: session
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


@pytest.fixture
async def auth_headers(client) -> dict[str, str]:
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "pilot@test.dev",
            "password": "secret123",
            "firstName": "Ann",
            "lastName": "Pilot",
        },
    )
    resp = await client.post(
        "/api/v1/auth/login", data={"username": "pilot@test.dev", "password": "secret123"}
    )
    return {"Authorization": f"Bearer {resp.json()['access_token']}"}
