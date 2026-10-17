"""Fill an empty database with demo data.

Usage: python -m app.seed            (after `alembic upgrade head`)

Idempotent: tables that already have rows are left untouched, so it is safe to
run on every deploy.
"""

import asyncio
import json
import logging
from pathlib import Path

from sqlalchemy import func, select

from app.core.database import SessionFactory, engine
from app.core.security import hash_password
from app.models import NewsPost, Product, User

logger = logging.getLogger("app.seed")

DATA_FILE = Path(__file__).with_name("seed_data.json")
DEMO_USER = {
    "email": "demo@jmil.dev",
    "password": "demo12345",
    "first_name": "Demo",
    "last_name": "User",
    "phone": "+380501234567",
}


async def seed() -> None:
    data = json.loads(DATA_FILE.read_text())
    async with SessionFactory() as session:
        if not await session.scalar(select(func.count()).select_from(Product)):
            session.add_all(Product(**p) for p in data["products"])
            logger.info("Inserted %d products", len(data["products"]))
        if not await session.scalar(select(func.count()).select_from(NewsPost)):
            session.add_all(NewsPost(**n) for n in data["news"])
            logger.info("Inserted %d news posts", len(data["news"]))
        if not await session.scalar(select(User).where(User.email == DEMO_USER["email"])):
            user = dict(DEMO_USER)
            session.add(User(password_hash=hash_password(user.pop("password")), **user))
            logger.info("Created demo user %s", DEMO_USER["email"])
        await session.commit()
    await engine.dispose()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    asyncio.run(seed())
