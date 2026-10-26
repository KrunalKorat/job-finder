from sqlalchemy import Boolean, Column, String
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin


class User(Base, TimestampMixin):
    __tablename__ = "users"

    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    status = Column(String(50), default="active", nullable=False)  # active, suspended, pending

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    career_preference = relationship("CareerPreference", back_populates="user", uselist=False, cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    automation_setting = relationship("AutomationSetting", back_populates="user", uselist=False, cascade="all, delete-orphan")
