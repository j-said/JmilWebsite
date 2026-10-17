from functools import lru_cache
from typing import Annotated

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict
from sqlalchemy.engine import URL


class Settings(BaseSettings):
    """Runtime configuration, read from environment variables (and `.env` locally).

    The database can be configured either with a full `DATABASE_URL` or with the
    separate `DB_*` parts (handy when a cloud secret exposes host/user/password
    separately). Parts are assembled with `URL.create`, so passwords with special
    characters are escaped correctly.
    """

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "JmilDrones API"
    ENVIRONMENT: str = "local"
    LOG_LEVEL: str = "INFO"

    DATABASE_URL: str | None = None
    DB_USER: str = "jmil"
    DB_PASSWORD: str = "jmil"
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "jmil"
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 5
    DB_ECHO: bool = False

    JWT_SECRET: str = Field(default="change-me-in-production", min_length=16)
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24

    # Comma-separated list, e.g. "http://localhost:5173,https://shop.example.com"
    CORS_ORIGINS: Annotated[list[str], NoDecode] = ["http://localhost:5173"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def _split_csv(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value

    @property
    def database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return URL.create(
            drivername="postgresql+asyncpg",
            username=self.DB_USER,
            password=self.DB_PASSWORD,
            host=self.DB_HOST,
            port=self.DB_PORT,
            database=self.DB_NAME,
        ).render_as_string(hide_password=False)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
