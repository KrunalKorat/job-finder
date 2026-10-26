from sqlalchemy import Boolean, Column, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin


class AutomationSetting(Base, TimestampMixin):
    __tablename__ = "automation_settings"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    # Critical Safety: Automation MUST default to False
    automation_enabled = Column(Boolean, default=False, nullable=False)
    automation_mode = Column(String(50), default="manual_review", nullable=False)
    
    min_match_score = Column(Integer, default=80, nullable=False)
    max_applications_per_day = Column(Integer, default=5, nullable=False)
    max_applications_per_week = Column(Integer, default=20, nullable=False)
    
    approved_providers = Column(JSON, default=list, nullable=False)
    excluded_employers = Column(JSON, default=list, nullable=False)
    
    # Critical Safety: Require approval MUST default to True
    require_approval = Column(Boolean, default=True, nullable=False)

    user = relationship("User", back_populates="automation_setting")
