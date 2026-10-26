import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Job Finder"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    # Security & Tokens
    SECRET_KEY: str = "jobfinder-dev-secret-key-change-in-production-min-32-chars-long"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Cookie settings
    COOKIE_NAME: str = "jf_session"
    COOKIE_SECURE: bool = False  # Set to True in production
    COOKIE_SAMESITE: str = "lax"
    COOKIE_DOMAIN: Union[str, None] = None

    # CORS & Allowed Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, str)):
            return v
        return ["http://localhost:3000"]

    FRONTEND_URL: str = "http://localhost:3000"

    # Database
    DATABASE_URL: str = "sqlite:///./jobfinder.db"
    # To use PostgreSQL in local dev or Docker:
    # DATABASE_URL: str = "postgresql://jobfinder:jobfinder@localhost:5432/jobfinder"

    # Redis & Celery
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: Union[str, None] = None
    CELERY_RESULT_BACKEND: Union[str, None] = None

    # Optional Email Settings
    SMTP_TLS: bool = True
    SMTP_PORT: Union[int, None] = 587
    SMTP_HOST: Union[str, None] = None
    SMTP_USER: Union[str, None] = None
    SMTP_PASSWORD: Union[str, None] = None
    EMAILS_FROM_EMAIL: Union[str, None] = "support@jobfinder.local"
    EMAILS_FROM_NAME: Union[str, None] = "Job Finder"

    # Optional LLM & External Services
    LLM_API_KEY: Union[str, None] = None
    LLM_MODEL: str = "gemini-1.5-flash"

    # Storage (local fallback or S3/R2)
    STORAGE_BACKEND: str = "local"
    STORAGE_DIR: str = "./uploads"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
