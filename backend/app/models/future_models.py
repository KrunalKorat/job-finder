from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin


class Job(Base, TimestampMixin):
    """Future migration-ready boundary for normalized jobs discovered from official sources."""
    __tablename__ = "jobs"

    provider_id = Column(String(50), nullable=False, index=True)
    external_job_id = Column(String(255), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=False, index=True)
    location = Column(String(255), nullable=True)
    work_arrangement = Column(String(50), nullable=True)
    employment_type = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    job_url = Column(String(1024), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    posted_at = Column(DateTime(timezone=True), nullable=True)


class MatchResult(Base, TimestampMixin):
    """Future migration-ready boundary for AI/algorithmic job-to-resume matching."""
    __tablename__ = "match_results"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    match_score = Column(Integer, nullable=False)  # 0-100
    score_breakdown = Column(JSON, default=dict, nullable=False)
    skill_gaps = Column(JSON, default=list, nullable=False)


class Application(Base, TimestampMixin):
    """Future migration-ready boundary for job applications."""
    __tablename__ = "applications"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(50), default="draft", nullable=False)  # draft, submitted, reviewing, interview, rejected, offer
    submission_method = Column(String(50), default="manual", nullable=False)  # manual, automated_authorized
    provider_id = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)


class ApplicationEvent(Base, TimestampMixin):
    """Future migration-ready boundary for timeline activity on applications."""
    __tablename__ = "application_events"

    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False, index=True)
    event_type = Column(String(50), nullable=False)
    event_payload = Column(JSON, default=dict, nullable=False)


class GeneratedDocument(Base, TimestampMixin):
    """Future migration-ready boundary for tailored resumes and cover letters."""
    __tablename__ = "generated_documents"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    doc_type = Column(String(50), nullable=False)  # tailored_resume, cover_letter
    content_key = Column(String(512), nullable=False)


class InterviewEvent(Base, TimestampMixin):
    """Future migration-ready boundary for scheduled interviews."""
    __tablename__ = "interview_events"

    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False, index=True)
    scheduled_time = Column(DateTime(timezone=True), nullable=False)
    interview_type = Column(String(50), nullable=False)  # recruiter_screen, technical, behavioral


class Notification(Base, TimestampMixin):
    """Future migration-ready boundary for user alerts."""
    __tablename__ = "notifications"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)


class AutomationRun(Base, TimestampMixin):
    """Future migration-ready boundary for audit runs of background automation workers."""
    __tablename__ = "automation_runs"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(50), nullable=False)  # started, completed, skipped, failed
    processed_count = Column(Integer, default=0, nullable=False)
    submitted_count = Column(Integer, default=0, nullable=False)
    details = Column(JSON, default=dict, nullable=False)


class AuditLog(Base, TimestampMixin):
    """Future migration-ready audit logging table for security and policy tracking."""
    __tablename__ = "audit_logs"

    user_id = Column(Integer, nullable=True, index=True)
    action = Column(String(100), nullable=False, index=True)
    ip_address = Column(String(45), nullable=True)
    metadata_json = Column(JSON, default=dict, nullable=False)
