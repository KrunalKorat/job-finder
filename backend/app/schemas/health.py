from datetime import datetime
from typing import Dict, Optional
from pydantic import BaseModel


class LiveHealthResponse(BaseModel):
    status: str = "ok"
    timestamp: datetime


class DependencyStatus(BaseModel):
    status: str  # healthy, degraded, unreachable
    latency_ms: Optional[float] = None


class ReadyHealthResponse(BaseModel):
    status: str  # ready, degraded, unready
    timestamp: datetime
    dependencies: Dict[str, DependencyStatus]
