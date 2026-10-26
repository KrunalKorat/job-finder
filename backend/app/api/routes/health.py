import time
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import get_db
from app.schemas.health import DependencyStatus, LiveHealthResponse, ReadyHealthResponse

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/live", response_model=LiveHealthResponse)
def liveness_check():
    """Liveness probe: verifies process is alive and responsive."""
    return LiveHealthResponse(
        status="ok",
        timestamp=datetime.now(timezone.utc),
    )


@router.get("/ready", response_model=ReadyHealthResponse)
def readiness_check(db: Session = Depends(get_db)):
    """
    Readiness probe: checks essential dependencies without revealing credentials or secrets.
    """
    dependencies = {}
    is_ready = True

    # Check Database
    try:
        start_time = time.perf_counter()
        db.execute(text("SELECT 1"))
        latency = (time.perf_counter() - start_time) * 1000
        dependencies["database"] = DependencyStatus(status="healthy", latency_ms=round(latency, 2))
    except Exception:
        dependencies["database"] = DependencyStatus(status="unreachable", latency_ms=None)
        is_ready = False

    # Check Redis (optional dependency in local dev)
    try:
        import redis
        start_time = time.perf_counter()
        r = redis.from_url(settings.REDIS_URL, socket_timeout=1.0)
        r.ping()
        latency = (time.perf_counter() - start_time) * 1000
        dependencies["redis"] = DependencyStatus(status="healthy", latency_ms=round(latency, 2))
    except Exception:
        # In dev or standalone, redis may be offline; mark as degraded rather than completely failing
        dependencies["redis"] = DependencyStatus(status="unreachable", latency_ms=None)
        if settings.ENVIRONMENT == "production":
            is_ready = False

    overall_status = "ready" if is_ready else "degraded"
    status_code = status.HTTP_200_OK if is_ready or settings.ENVIRONMENT != "production" else status.HTTP_503_SERVICE_UNAVAILABLE

    return JSONResponse(
        status_code=status_code,
        content=ReadyHealthResponse(
            status=overall_status,
            timestamp=datetime.now(timezone.utc),
            dependencies=dependencies,
        ).model_dump(mode="json"),
    )
