import json

from sqlalchemy import func, select

from app.models import Order
from tests.conftest import register_and_login
from tests.test_orders import order_payload


async def count_orders(session) -> int:
    return await session.scalar(select(func.count()).select_from(Order))


async def test_same_key_creates_one_order_and_returns_same_response(
    client, session, products, auth_headers
):
    headers = {**auth_headers, "Idempotency-Key": "3f1c2a9e-order-1"}
    payload = order_payload((products[0].id, 2))

    first = await client.post("/api/v1/orders", json=payload, headers=headers)
    second = await client.post("/api/v1/orders", json=payload, headers=headers)

    assert first.status_code == second.status_code == 201
    assert first.json() == second.json()
    assert first.headers["location"] == second.headers["location"]
    assert "idempotent-replayed" not in first.headers
    assert second.headers["idempotent-replayed"] == "true"
    assert await count_orders(session) == 1


async def test_without_key_every_request_executes(client, session, products, auth_headers):
    payload = order_payload((products[0].id, 1))
    for _ in range(2):
        resp = await client.post("/api/v1/orders", json=payload, headers=auth_headers)
        assert resp.status_code == 201
    assert await count_orders(session) == 2


async def test_key_reused_with_other_body_is_rejected(client, products, auth_headers):
    headers = {**auth_headers, "Idempotency-Key": "3f1c2a9e-order-2"}
    await client.post("/api/v1/orders", json=order_payload((products[0].id, 1)), headers=headers)
    resp = await client.post(
        "/api/v1/orders", json=order_payload((products[1].id, 1)), headers=headers
    )
    assert resp.status_code == 422


async def test_request_in_progress_is_a_conflict(client, products, auth_headers, redis):
    # A duplicate arrives while the first request is still running.
    payload = order_payload((products[0].id, 1))
    first = await client.post(
        "/api/v1/orders", json=payload, headers={**auth_headers, "Idempotency-Key": "key-aaaa"}
    )
    user_scope = (await redis.keys("idem:orders:*"))[0].rsplit(":", 1)[0]
    record = json.loads(await redis.get(f"{user_scope}:key-aaaa"))
    await redis.set(
        f"{user_scope}:key-bbbb", json.dumps({"state": "processing", "fp": record["fp"]})
    )

    resp = await client.post(
        "/api/v1/orders", json=payload, headers={**auth_headers, "Idempotency-Key": "key-bbbb"}
    )
    assert first.status_code == 201
    assert resp.status_code == 409


async def test_failed_request_can_be_retried_with_same_key(client, products, auth_headers):
    headers = {**auth_headers, "Idempotency-Key": "3f1c2a9e-order-3"}
    gamma = products[2]  # out of stock
    resp = await client.post("/api/v1/orders", json=order_payload((gamma.id, 1)), headers=headers)
    assert resp.status_code == 422
    # The key was released, so the request runs again instead of being replayed.
    resp = await client.post("/api/v1/orders", json=order_payload((gamma.id, 1)), headers=headers)
    assert resp.status_code == 422
    assert "idempotent-replayed" not in resp.headers


async def test_keys_are_scoped_per_user(client, session, products, auth_headers):
    payload = order_payload((products[0].id, 1))
    await client.post(
        "/api/v1/orders", json=payload, headers={**auth_headers, "Idempotency-Key": "shared-key"}
    )
    other = await register_and_login(client, "b@test.dev")
    resp = await client.post(
        "/api/v1/orders",
        json=payload,
        headers={**other, "Idempotency-Key": "shared-key"},
    )
    assert resp.status_code == 201
    assert "idempotent-replayed" not in resp.headers
    assert await count_orders(session) == 2
