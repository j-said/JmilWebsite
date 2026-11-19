"""Cache-aside: read from Redis, on a miss load from the DB and store with a TTL.

If Redis is down the request still works, just without the cache.
"""

import hashlib
import logging
from collections.abc import Awaitable, Callable
from enum import StrEnum

from redis.asyncio import Redis
from redis.exceptions import RedisError

from app.core.config import settings

logger = logging.getLogger(__name__)


class CacheStatus(StrEnum):
    HIT = "HIT"
    MISS = "MISS"
    BYPASS = "BYPASS"


def make_key(namespace: str, raw: str) -> str:
    return f"cache:{namespace}:{hashlib.sha256(raw.encode()).hexdigest()[:32]}"


async def cache_aside(
    redis: Redis | None,
    key: str,
    loader: Callable[[], Awaitable[str]],
    ttl: int | None = None,
) -> tuple[str, CacheStatus]:
    if redis is None or not settings.CACHE_ENABLED:
        return await loader(), CacheStatus.BYPASS

    try:
        cached = await redis.get(key)
    except RedisError as exc:
        logger.warning("cache read failed: %s", exc)
        return await loader(), CacheStatus.BYPASS
    if cached is not None:
        return cached, CacheStatus.HIT

    value = await loader()
    try:
        await redis.set(key, value, ex=ttl or settings.CACHE_TTL_SECONDS)
    except RedisError as exc:
        logger.warning("cache write failed: %s", exc)
    return value, CacheStatus.MISS


async def invalidate(redis: Redis | None, namespace: str) -> int:
    """Delete all cached entries of a namespace. Call after the data changes."""
    if redis is None:
        return 0
    deleted = 0
    try:
        async for key in redis.scan_iter(match=f"cache:{namespace}:*", count=500):
            deleted += await redis.delete(key)
    except RedisError as exc:
        logger.warning("cache invalidation failed: %s", exc)
    return deleted
