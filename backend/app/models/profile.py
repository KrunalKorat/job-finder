from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin


class UserProfile(Base, TimestampMixin):
    __tablename__ = "user_profiles"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=True)
    professional_headline = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    portfolio_url = Column(String(512), nullable=True)
    linkedin_url = Column(String(512), nullable=True)
    profile_completion_status = Column(String(50), default="incomplete", nullable=False)

    user = relationship("User", back_populates="profile")
