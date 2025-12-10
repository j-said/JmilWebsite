import pytest

@pytest.mark.asyncio
async def test_get_products_empty(client):
    response = await client.get("/api/products")
    assert response.status_code == 200
    data = response.json()
    assert data["products"] == []
    assert data["total"] == 0

@pytest.mark.asyncio
async def test_create_and_get_product(client, async_session):
    # Додаємо тестові дані напряму в БД (через SQL або моделі)
    from database import Product
    new_product = Product(
        name="Test Drone", 
        price=100.00, 
        on_sale=False, 
        in_stock=True,
        brand="DJI",
        category="Professional"
    )
    async_session.add(new_product)
    await async_session.commit()

    # Перевіряємо через API
    response = await client.get("/api/products")
    assert response.status_code == 200
    data = response.json()
    assert len(data["products"]) == 1
    assert data["products"][0]["name"] == "Test Drone"