from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin


class Resume(Base, TimestampMixin):
    __tablename__ = "resumes"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    storage_key = Column(String(512), nullable=False)
    original_filename = Column(String(255), nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)  # size in bytes
    upload_status = Column(String(50), default="completed", nullable=False)  # pending, completed, failed
    processing_status = Column(String(50), default="unprocessed", nullable=False)  # unprocessed, processing, parsed, error

    user = relationship("User", back_populates="resumes")
