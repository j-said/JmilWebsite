"""Idempotency-Key for write endpoints.

The first request with a key runs and its response is saved in Redis for 24 h.
A repeat with the same key gets the saved response and nothing runs again.
Keys are per user and per operation.
"""

import hashlib
import json
import logging
from collections.abc import Awaitable, Callable
from dataclasses import asdict, dataclass, field

from fastapi import Response
from redis.asyncio import Redis
from redis.exceptions import RedisError

from app.core.config import settings
from app.core.exceptions import ConflictError, ServiceUnavailableError, ValidationError

logger = logging.getLogger(__name__)

PROCESSING_TTL_SECONDS = 60
REPLAY_HEADER = "Idempotent-Replayed"


@dataclass
class StoredResponse:
    status_code: int
    body: str
    headers: dict[str, str] = field(default_factory=dict)

    def to_response(self, replayed: bool = False) -> Response:
        headers = dict(self.headers)
        if replayed:
            headers[REPLAY_HEADER] = "true"
        return Response(
            self.body, status_code=self.status_code, media_type="application/json", headers=headers
        )


def fingerprint(payload: str) -> str:
    return hashlib.sha256(payload.encode()).hexdigest()


async def run_idempotent(
    redis: Redis | None,
    *,
    scope: str,
    key: str | None,
    payload: str,
    handler: Callable[[], Awaitable[StoredResponse]],
) -> Response:
    """Run `handler` once per (scope, key). Without a key it just runs."""
    if key is None:
        return (await handler()).to_response()
    if redis is None:
        raise ServiceUnavailableError("Idempotency-Key is not supported right now")

    redis_key = f"idem:{scope}:{key}"
    fp = fingerprint(payload)
    marker = json.dumps({"state": "processing", "fp": fp})
    try:
        # NX: only one request can take the key. The short TTL frees it if we crash.
        acquired = await redis.set(redis_key, marker, nx=True, ex=PROCESSING_TTL_SECONDS)
        stored = None if acquired else await redis.get(redis_key)
    except RedisError as exc:
        raise ServiceUnavailableError("Idempotency storage is unavailable") from exc

    if not acquired:
        record = json.loads(stored) if stored else None
        if record is not None and record["fp"] != fp:
            raise ValidationError("Idempotency-Key was already used with a different request")
        if record is None or record["state"] == "processing":
            raise ConflictError("A request with this Idempotency-Key is in progress")
        return StoredResponse(**record["response"]).to_response(replayed=True)

    try:
        result = await handler()
    except BaseException:
        try:
            await redis.delete(redis_key)  # let the client retry
        except RedisError:
            logger.warning("could not release idempotency key %s", redis_key)
        raise

    record = {"state": "done", "fp": fp, "response": asdict(result)}
    try:
        await redis.set(redis_key, json.dumps(record), ex=settings.IDEMPOTENCY_TTL_SECONDS)
    except RedisError:
        # The order is already created, so still return it.
        logger.exception("could not store idempotent response for %s", redis_key)
    return result.to_response()
