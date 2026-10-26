import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, Union
from app.core.config import settings


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8"),
        )
    except Exception:
        return False


def create_access_token(
    subject: Union[str, Any],
    expires_delta: Optional[timedelta] = None,
    extra_claims: Optional[Dict[str, Any]] = None,
) -> str:
    """Create a signed JWT access token."""
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode: Dict[str, Any] = {
        "sub": str(subject),
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
        "type": "access",
    }
    if extra_claims:
        to_encode.update(extra_claims)

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate a JWT access token."""
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            options={"require": ["exp", "sub"]},
        )
        if payload.get("type") != "access":
            return None
        return payload
    except jwt.PyJWTError:
        return None


def generate_password_reset_token(email: str) -> str:
    """Generate a signed single-purpose token for password reset (valid 1 hour)."""
    now = datetime.now(timezone.utc)
    expire = now + timedelta(hours=1)
    to_encode = {
        "sub": email,
        "type": "reset",
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_password_reset_token(token: str) -> Optional[str]:
    """Verify password reset token and return the email if valid."""
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            options={"require": ["exp", "sub"]},
        )
        if payload.get("type") != "reset":
            return None
        return payload.get("sub")
    except jwt.PyJWTError:
        return None


def generate_email_verification_token(email: str) -> str:
    """Generate a signed single-purpose token for email verification (valid 24 hours)."""
    now = datetime.now(timezone.utc)
    expire = now + timedelta(hours=24)
    to_encode = {
        "sub": email,
        "type": "verify",
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_email_verification_token(token: str) -> Optional[str]:
    """Verify email verification token and return the email if valid."""
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            options={"require": ["exp", "sub"]},
        )
        if payload.get("type") != "verify":
            return None
        return payload.get("sub")
    except jwt.PyJWTError:
        return None
