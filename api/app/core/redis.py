from typing import Annotated

from fastapi import Depends
from redis.asyncio import Redis

from app.core.config import settings

_client: Redis | None = None


def get_redis() -> Redis | None:
    global _client
    if not settings.REDIS_URL:
        return None
    if _client is None:
        # Short timeouts: if Redis hangs, we fall back to the DB instead of waiting.
        _client = Redis.from_url(
            settings.REDIS_URL,
            decode_responses=True,
            socket_timeout=0.5,
            socket_connect_timeout=0.5,
            health_check_interval=30,
        )
    return _client


async def close_redis() -> None:
    global _client
    if _client is not None:
        await _client.aclose()
        _client = None


RedisDep = Annotated[Redis | None, Depends(get_redis)]
