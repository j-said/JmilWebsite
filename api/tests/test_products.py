async def test_empty_catalog(client):
    resp = await client.get("/api/v1/products")
    assert resp.status_code == 200
    assert resp.json() == {"items": [], "total": 0, "page": 1, "limit": 12, "pages": 0}


async def test_list_filters_and_sort(client, products):
    resp = await client.get("/api/v1/products", params={"feature": "GPS", "sort": "price-desc"})
    names = [p["name"] for p in resp.json()["items"]]
    assert names == ["Beta Racer", "Alpha Drone"]

    resp = await client.get("/api/v1/products", params={"brand": ["DJI", "Generic"]})
    assert resp.json()["total"] == 2

    resp = await client.get("/api/v1/products", params={"minPrice": 60, "maxPrice": 200})
    assert [p["name"] for p in resp.json()["items"]] == ["Alpha Drone"]


async def test_search_treats_wildcards_literally(client, products):
    resp = await client.get("/api/v1/products", params={"search": "%"})
    assert resp.json()["total"] == 0
    resp = await client.get("/api/v1/products", params={"search": "racer"})
    assert resp.json()["total"] == 1


async def test_pagination(client, products):
    resp = await client.get("/api/v1/products", params={"limit": 2, "page": 2})
    body = resp.json()
    assert body["total"] == 3 and body["pages"] == 2
    assert len(body["items"]) == 1


async def test_invalid_query_is_rejected(client):
    assert (await client.get("/api/v1/products", params={"sort": "bogus"})).status_code == 422
    resp = await client.get("/api/v1/products", params={"minPrice": 10, "maxPrice": 5})
    assert resp.status_code == 422


async def test_product_detail_and_on_sale(client, products):
    resp = await client.get(f"/api/v1/products/{products[1].id}")
    assert resp.status_code == 200
    assert resp.json()["onSale"] is True
    assert (await client.get("/api/v1/products/999999")).status_code == 404


async def test_facets(client, products):
    body = (await client.get("/api/v1/products/facets")).json()
    assert body["categories"] == ["Camera", "FPV"]
    assert body["features"] == ["4K", "GPS"]
    assert body["priceRange"] == {"min": 50.0, "max": 300.0}
