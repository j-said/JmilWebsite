from datetime import UTC, datetime, timedelta

import jwt
from pwdlib import PasswordHash

from app.core.config import settings

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return password_hash.verify(password, hashed)


def create_access_token(subject: str | int) -> tuple[str, int]:
    """Return a signed JWT and its lifetime in seconds."""
    expires_in = settings.JWT_EXPIRE_MINUTES * 60
    now = datetime.now(UTC)
    payload = {"sub": str(subject), "iat": now, "exp": now + timedelta(seconds=expires_in)}
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token, expires_in


def decode_access_token(token: str) -> str | None:
    """Return the token subject, or None if the token is invalid or expired."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except jwt.InvalidTokenError:
        return None
    return payload.get("sub")
