from typing import Optional
from fastapi import Cookie, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User
from app.repositories.user_repo import UserRepository


def get_token_from_request(
    authorization: Optional[str] = Header(None),
    jf_session: Optional[str] = Cookie(None),
) -> Optional[str]:
    """Extracts access token from Authorization header or HttpOnly session cookie."""
    if authorization and authorization.startswith("Bearer "):
        return authorization.split(" ", 1)[1]
    if jf_session:
        return jf_session
    return None


def get_current_user(
    token: Optional[str] = Depends(get_token_from_request),
    db: Session = Depends(get_db),
) -> User:
    """Dependency that authenticates the current user."""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(token)
    if not payload or not payload.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        user_id = int(payload["sub"])
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Malformed token payload.",
        )

    user = UserRepository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists.",
        )

    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive or suspended.",
        )

    return user
