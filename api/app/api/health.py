from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.api.deps import SessionDep

router = APIRouter(tags=["health"])


@router.get("/health")
async def liveness():
    """Process is up. Use this for the load balancer health check."""
    return {"status": "ok"}


@router.get("/health/ready")
async def readiness(session: SessionDep):
    """Process is up *and* the database answers."""
    try:
        await session.execute(text("SELECT 1"))
    except Exception:
        return JSONResponse(
            {"status": "unavailable", "database": "down"},
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
    return {"status": "ok", "database": "up"}
