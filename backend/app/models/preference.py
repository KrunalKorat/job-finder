from sqlalchemy import Boolean, Column, ForeignKey, Integer, JSON, Numeric, String
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin


class CareerPreference(Base, TimestampMixin):
    __tablename__ = "career_preferences"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    desired_job_titles = Column(JSON, default=list, nullable=False)
    skills = Column(JSON, default=list, nullable=False)
    preferred_locations = Column(JSON, default=list, nullable=False)
    work_arrangements = Column(JSON, default=list, nullable=False)  # ["remote", "hybrid", "onsite"]
    employment_types = Column(JSON, default=list, nullable=False)   # ["full_time", "contract", "part_time"]
    
    min_salary = Column(Integer, nullable=True)
    salary_currency = Column(String(10), default="USD", nullable=False)
    preferred_industries = Column(JSON, default=list, nullable=False)
    
    work_authorization_status = Column(String(100), default="authorized", nullable=False)
    sponsorship_required = Column(Boolean, default=False, nullable=False)
    
    excluded_employers = Column(JSON, default=list, nullable=False)
    matching_threshold = Column(Integer, default=75, nullable=False)

    user = relationship("User", back_populates="career_preference")
