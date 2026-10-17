from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, EmailStr, Field, StringConstraints

from app.schemas.common import CamelModel

Name = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=50)]
Phone = Annotated[str, StringConstraints(strip_whitespace=True, pattern=r"^\+?[0-9 ()\-]{7,20}$")]


class UserCreate(CamelModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    first_name: Name
    last_name: Name
    phone: Phone | None = None


class UserUpdate(CamelModel):
    first_name: Name | None = None
    last_name: Name | None = None
    phone: Phone | None = None


class UserRead(CamelModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    phone: str | None
    created_at: datetime


class Token(BaseModel):
    # OAuth2 field names are snake_case by spec (Swagger's "Authorize" relies on it).
    access_token: str
    token_type: str = "bearer"
    expires_in: int
