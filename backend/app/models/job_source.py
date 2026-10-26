from sqlalchemy import Boolean, Column, Integer, String
from app.db.session import Base
from app.models.base import TimestampMixin


class JobSourceRegistry(Base, TimestampMixin):
    __tablename__ = "job_source_registry"

    provider_id = Column(String(50), unique=True, index=True, nullable=False)
    provider_name = Column(String(100), nullable=False)
    base_url_or_ref = Column(String(512), nullable=False)
    integration_type = Column(String(50), nullable=False)  # official_api, ats_public_board, career_page
    
    can_discover_jobs = Column(Boolean, default=True, nullable=False)
    can_submit_applications = Column(Boolean, default=False, nullable=False)
    
    authorization_status = Column(String(50), default="authorized_public_read", nullable=False)
    is_enabled = Column(Boolean, default=True, nullable=False)
    last_sync_status = Column(String(100), nullable=True)
