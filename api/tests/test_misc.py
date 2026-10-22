from app.models import NewsPost


async def test_health(client):
    assert (await client.get("/health")).json() == {"status": "ok"}
    assert (await client.get("/health/ready")).json()["database"] == "up"


async def test_version(client):
    body = (await client.get("/health/version")).json()
    assert body["version"] == "2.0.0"
    assert set(body) == {"app", "version", "environment"}


async def test_news_list_and_detail(client, session):
    session.add_all([NewsPost(title=f"Post {i}", content="...") for i in range(3)])
    await session.commit()

    body = (await client.get("/api/v1/news", params={"limit": 2})).json()
    assert body["total"] == 3 and len(body["items"]) == 2

    post_id = body["items"][0]["id"]
    assert (await client.get(f"/api/v1/news/{post_id}")).status_code == 200
    assert (await client.get("/api/v1/news/999999")).status_code == 404
