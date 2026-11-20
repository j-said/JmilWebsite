import pytest
from redis.asyncio import Redis
from sqlalchemy import func, select

from app.core import queue
from app.core.config import settings
from app.core.redis import get_redis
from app.main import app
from app.models import Order
from app.worker import process_message
from tests.conftest import register_and_login
from tests.test_orders import order_payload


@pytest.fixture
def sent(monkeypatch) -> list[dict]:
    """SQS replaced with a list."""
    messages: list[dict] = []

    async def fake_send(body: dict) -> None:
        messages.append(body)

    monkeypatch.setattr(settings, "ORDER_QUEUE_URL", "https://sqs.test/queue")
    monkeypatch.setattr(settings, "WORKER_PROCESSING_SECONDS", 0)
    monkeypatch.setattr(queue, "send_message", fake_send)
    return messages


async def test_async_order_is_accepted_then_completed_by_worker(
    client, session, redis, products, auth_headers, sent
):
    resp = await client.post(
        "/api/v1/orders/async", json=order_payload((products[0].id, 2)), headers=auth_headers
    )
    assert resp.status_code == 202
    body = resp.json()
    assert body["status"] == "queued"
    assert body["orderId"] is None
    location = resp.headers["location"]
    assert location == f"/api/v1/orders/requests/{body['requestId']}"
    assert len(sent) == 1

    status = await client.get(location, headers=auth_headers)
    assert status.json()["status"] == "queued"

    await process_message(sent[0], session, redis)

    status = (await client.get(location, headers=auth_headers)).json()
    assert status["status"] == "completed"
    order = await client.get(f"/api/v1/orders/{status['orderId']}", headers=auth_headers)
    assert order.status_code == 200
    assert order.json()["total"] == 200


async def test_redelivered_message_creates_one_order(
    client, session, redis, products, auth_headers, sent
):
    await client.post(
        "/api/v1/orders/async", json=order_payload((products[0].id, 1)), headers=auth_headers
    )
    # SQS delivered the same message twice.
    await process_message(sent[0], session, redis)
    await process_message(sent[0], session, redis)

    assert await session.scalar(select(func.count()).select_from(Order)) == 1


async def test_business_error_marks_request_failed(
    client, session, redis, products, auth_headers, sent
):
    resp = await client.post(
        "/api/v1/orders/async", json=order_payload((products[2].id, 1)), headers=auth_headers
    )
    await process_message(sent[0], session, redis)

    status = (await client.get(resp.headers["location"], headers=auth_headers)).json()
    assert status["status"] == "failed"
    assert "Out of stock" in status["error"]


async def test_idempotency_key_enqueues_once(client, products, auth_headers, sent):
    headers = {**auth_headers, "Idempotency-Key": "async-key-0001"}
    payload = order_payload((products[0].id, 1))
    first = await client.post("/api/v1/orders/async", json=payload, headers=headers)
    second = await client.post("/api/v1/orders/async", json=payload, headers=headers)

    assert first.json() == second.json()
    assert second.headers["idempotent-replayed"] == "true"
    assert len(sent) == 1


async def test_request_status_is_private(client, products, auth_headers, sent):
    resp = await client.post(
        "/api/v1/orders/async", json=order_payload((products[0].id, 1)), headers=auth_headers
    )
    other_headers = await register_and_login(client, "c@test.dev")
    other = await client.get(resp.headers["location"], headers=other_headers)
    assert other.status_code == 404


async def test_async_endpoint_without_queue_is_unavailable(client, products, auth_headers):
    resp = await client.post(
        "/api/v1/orders/async", json=order_payload((products[0].id, 1)), headers=auth_headers
    )
    assert resp.status_code == 503


async def test_redis_outage_on_status_is_unavailable(client, products, auth_headers, sent):
    resp = await client.post(
        "/api/v1/orders/async", json=order_payload((products[0].id, 1)), headers=auth_headers
    )
    dead = Redis.from_url("redis://127.0.0.1:1/0", socket_connect_timeout=0.2)
    app.dependency_overrides[get_redis] = lambda: dead
    status = await client.get(resp.headers["location"], headers=auth_headers)
    await dead.aclose()
    assert status.status_code == 503
    assert status.headers["retry-after"] == "1"
