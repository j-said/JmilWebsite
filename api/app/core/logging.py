import logging
import sys
import time

from fastapi import FastAPI, Request

logger = logging.getLogger("app.access")


def setup_logging(level: str) -> None:
    # Containers ship stdout to the cloud log service, so plain one-line records are enough.
    logging.basicConfig(
        level=level,
        stream=sys.stdout,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
        force=True,
    )


def register_access_log(app: FastAPI) -> None:
    @app.middleware("http")
    async def access_log(request: Request, call_next):
        started = time.perf_counter()
        response = await call_next(request)
        duration_ms = (time.perf_counter() - started) * 1000
        if request.url.path not in {"/health", "/health/ready"}:
            logger.info(
                "%s %s %s %.1fms",
                request.method,
                request.url.path,
                response.status_code,
                duration_ms,
            )
        return response
