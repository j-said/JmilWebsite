from redis.asyncio import Redis

from app.core.config import settings
from app.core.redis import get_redis
from app.main import app


async def test_product_list_is_cached(client, products, redis):
    first = await client.get("/api/v1/products?sort=price")
    second = await client.get("/api/v1/products?sort=price")

    assert first.headers["x-cache"] == "MISS"
    assert second.headers["x-cache"] == "HIT"
    assert first.json() == second.json()
    assert first.json()["total"] == 3
    keys = [k async for k in redis.scan_iter("cache:products:list:*")]
    assert len(keys) == 1
    assert 0 < await redis.ttl(keys[0]) <= settings.CACHE_TTL_SECONDS


async def test_each_query_has_its_own_entry(client, products):
    await client.get("/api/v1/products?sort=price")
    other = await client.get("/api/v1/products?sort=price&brand=DJI")
    assert other.headers["x-cache"] == "MISS"
    assert other.json()["total"] == 1


async def test_cache_can_be_disabled(client, products, monkeypatch):
    monkeypatch.setattr(settings, "CACHE_ENABLED", False)
    for _ in range(2):
        resp = await client.get("/api/v1/products")
        assert resp.headers["x-cache"] == "BYPASS"
        assert resp.json()["total"] == 3


async def test_redis_outage_falls_back_to_database(client, products):
    dead = Redis.from_url("redis://127.0.0.1:1/0", socket_connect_timeout=0.2)
    app.dependency_overrides[get_redis] = lambda: dead
    resp = await client.get("/api/v1/products")
    assert resp.status_code == 200
    assert resp.headers["x-cache"] == "BYPASS"
    assert resp.json()["total"] == 3
    await dead.aclose()
