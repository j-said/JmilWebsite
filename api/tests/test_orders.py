def order_payload(*items):
    return {
        "firstName": "Ann",
        "lastName": "Pilot",
        "phone": "+380501234567",
        "items": [{"productId": pid, "quantity": qty} for pid, qty in items],
    }


async def test_create_order_uses_db_prices(client, products, auth_headers):
    alpha, beta, _ = products
    payload = order_payload((alpha.id, 2), (beta.id, 1), (alpha.id, 1))
    # Extra fields such as a client-side price are ignored.
    payload["items"][0]["price"] = 0.01
    resp = await client.post("/api/v1/orders", json=payload, headers=auth_headers)

    assert resp.status_code == 201
    order = resp.json()
    assert resp.headers["location"] == f"/api/v1/orders/{order['id']}"
    assert order["status"] == "pending"
    assert order["total"] == 3 * 100 + 300
    lines = {i["productId"]: i for i in order["items"]}
    assert lines[alpha.id]["quantity"] == 3
    assert lines[alpha.id]["productName"] == "Alpha Drone"


async def test_create_order_rejects_out_of_stock_and_unknown(client, products, auth_headers):
    gamma = products[2]
    resp = await client.post(
        "/api/v1/orders", json=order_payload((gamma.id, 1)), headers=auth_headers
    )
    assert resp.status_code == 422
    resp = await client.post(
        "/api/v1/orders", json=order_payload((999999, 1)), headers=auth_headers
    )
    assert resp.status_code == 422
    resp = await client.post("/api/v1/orders", json=order_payload(), headers=auth_headers)
    assert resp.status_code == 422


async def test_create_order_requires_auth(client, products):
    resp = await client.post("/api/v1/orders", json=order_payload((products[0].id, 1)))
    assert resp.status_code == 401


async def test_orders_are_listed_per_user(client, products, auth_headers):
    for _ in range(2):
        await client.post(
            "/api/v1/orders", json=order_payload((products[0].id, 1)), headers=auth_headers
        )
    resp = await client.get("/api/v1/orders", headers=auth_headers)
    body = resp.json()
    assert body["total"] == 2
    order_id = body["items"][0]["id"]

    assert (await client.get(f"/api/v1/orders/{order_id}", headers=auth_headers)).status_code == 200

    # Another user sees neither the list nor the single order.
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "other@test.dev",
            "password": "secret123",
            "firstName": "O",
            "lastName": "T",
        },
    )
    token = (
        await client.post(
            "/api/v1/auth/login", data={"username": "other@test.dev", "password": "secret123"}
        )
    ).json()["access_token"]
    other = {"Authorization": f"Bearer {token}"}
    assert (await client.get("/api/v1/orders", headers=other)).json()["total"] == 0
    assert (await client.get(f"/api/v1/orders/{order_id}", headers=other)).status_code == 404
