USER = {
    "email": "Someone@Test.dev",
    "password": "secret123",
    "firstName": "Some",
    "lastName": "One",
}


async def test_register_returns_user_without_password(client):
    resp = await client.post("/api/v1/auth/register", json=USER)
    assert resp.status_code == 201
    body = resp.json()
    assert body["email"] == "someone@test.dev"
    assert "password" not in body and "passwordHash" not in body


async def test_register_duplicate_email_is_case_insensitive(client):
    await client.post("/api/v1/auth/register", json=USER)
    resp = await client.post("/api/v1/auth/register", json={**USER, "email": "someone@test.dev"})
    assert resp.status_code == 409


async def test_register_validates_input(client):
    resp = await client.post("/api/v1/auth/register", json={**USER, "password": "short"})
    assert resp.status_code == 422


async def test_login_and_me(client):
    await client.post("/api/v1/auth/register", json=USER)
    resp = await client.post(
        "/api/v1/auth/login", data={"username": "someone@test.dev", "password": "secret123"}
    )
    assert resp.status_code == 200
    token = resp.json()["access_token"]

    me = await client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["firstName"] == "Some"


async def test_login_wrong_password(client):
    await client.post("/api/v1/auth/register", json=USER)
    resp = await client.post(
        "/api/v1/auth/login", data={"username": "someone@test.dev", "password": "nope-nope"}
    )
    assert resp.status_code == 401


async def test_protected_endpoints_require_token(client):
    assert (await client.get("/api/v1/users/me")).status_code == 401
    assert (await client.get("/api/v1/orders")).status_code == 401
    bad = {"Authorization": "Bearer not-a-jwt"}
    assert (await client.get("/api/v1/users/me", headers=bad)).status_code == 401


async def test_update_profile(client, auth_headers):
    resp = await client.patch(
        "/api/v1/users/me", json={"phone": "+380501112233"}, headers=auth_headers
    )
    assert resp.status_code == 200
    assert resp.json()["phone"] == "+380501112233"
    assert resp.json()["firstName"] == "Ann"
