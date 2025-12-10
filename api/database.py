from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Numeric,
    Boolean,
    TIMESTAMP,
    ARRAY,
    func,
)
from config import settings

# Engine
engine = create_async_engine(settings.DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()


# Dependency
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


# Models
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Numeric(10, 2), nullable=False)
    original_price = Column(Numeric(10, 2))
    on_sale = Column(Boolean, default=False)
    rating = Column(Numeric(3, 1))
    review_count = Column(Integer, default=0)
    category = Column(String)
    brand = Column(String)
    features = Column(ARRAY(Text))
    in_stock = Column(Boolean, default=True)
    image_url = Column(Text)
    images = Column(ARRAY(Text))
    created_at = Column(TIMESTAMP, server_default=func.now())


class NewsPost(Base):
    __tablename__ = "news_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
