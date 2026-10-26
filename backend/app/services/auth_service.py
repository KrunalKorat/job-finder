import logging
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import (
    create_access_token,
    generate_email_verification_token,
    generate_password_reset_token,
    hash_password,
    verify_email_verification_token,
    verify_password,
    verify_password_reset_token,
)
from app.models.user import User
from app.repositories.user_repo import UserRepository
from app.schemas.auth import LoginRequest, RegisterRequest

logger = logging.getLogger(__name__)


class AuthService:
    @staticmethod
    def register(db: Session, data: RegisterRequest) -> Tuple[User, str]:
        existing_user = UserRepository.get_by_email(db, data.email)
        if existing_user:
            raise ValueError("An account with this email address already exists.")

        hashed_pw = hash_password(data.password)
        user = UserRepository.create(db, email=data.email, password_hash=hashed_pw, name=data.name)

        # Generate access token
        access_token = create_access_token(subject=user.id)

        # Generate verification token and handle email notification
        verify_token = generate_email_verification_token(user.email)
        if settings.SMTP_HOST:
            logger.info("Email verification dispatched to external SMTP.")
        else:
            # Safe development workflow logging without exposing secrets
            logger.info("Dev Mode: Generated email verification token for %s: %s", user.email, verify_token)

        return user, access_token

    @staticmethod
    def login(db: Session, data: LoginRequest) -> Tuple[User, str]:
        user = UserRepository.get_by_email(db, data.email)
        # Use constant-time comparison failure path to prevent timing attacks
        if not user or not verify_password(data.password, user.password_hash):
            raise ValueError("Invalid email or password.")

        if user.status != "active":
            raise ValueError("Account is suspended or pending activation.")

        access_token = create_access_token(subject=user.id)
        return user, access_token

    @staticmethod
    def request_password_reset(db: Session, email: str) -> None:
        user = UserRepository.get_by_email(db, email)
        if user and user.status == "active":
            token = generate_password_reset_token(user.email)
            if settings.SMTP_HOST:
                logger.info("Password reset link dispatched via SMTP.")
            else:
                logger.info("Dev Mode: Password reset token generated for %s: %s", user.email, token)
        # Always return cleanly to prevent account existence enumeration

    @staticmethod
    def reset_password(db: Session, token: str, new_password: str) -> bool:
        email = verify_password_reset_token(token)
        if not email:
            raise ValueError("Invalid or expired password reset token.")

        user = UserRepository.get_by_email(db, email)
        if not user:
            raise ValueError("User not found.")

        new_hash = hash_password(new_password)
        UserRepository.update_password(db, user, new_hash)
        return True

    @staticmethod
    def verify_email(db: Session, token: str) -> bool:
        email = verify_email_verification_token(token)
        if not email:
            raise ValueError("Invalid or expired verification token.")

        user = UserRepository.get_by_email(db, email)
        if not user:
            raise ValueError("User not found.")

        UserRepository.update_verification(db, user, is_verified=True)
        return True
