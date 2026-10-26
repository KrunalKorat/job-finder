from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import get_db
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    VerifyEmailRequest,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


def set_auth_cookie(response: Response, token: str) -> None:
    """Sets a secure HttpOnly session cookie."""
    response.set_cookie(
        key=settings.COOKIE_NAME,
        value=token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        domain=settings.COOKIE_DOMAIN,
        path="/",
    )


def clear_auth_cookie(response: Response) -> None:
    """Clears the session cookie."""
    response.delete_cookie(
        key=settings.COOKIE_NAME,
        domain=settings.COOKIE_DOMAIN,
        path="/",
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(data: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    try:
        user, token = AuthService.register(db, data)
        set_auth_cookie(response, token)
        name = user.profile.name if user.profile else None
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user_id=user.id,
            email=user.email,
            is_verified=user.is_verified,
            name=name,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    try:
        user, token = AuthService.login(db, data)
        set_auth_cookie(response, token)
        name = user.profile.name if user.profile else None
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user_id=user.id,
            email=user.email,
            is_verified=user.is_verified,
            name=name,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/logout", response_model=MessageResponse)
def logout(response: Response):
    clear_auth_cookie(response)
    return MessageResponse(message="Successfully signed out.")


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    AuthService.request_password_reset(db, data.email)
    return MessageResponse(
        message="If an account with that email exists, password reset instructions have been dispatched."
    )


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        AuthService.reset_password(db, data.token, data.new_password)
        return MessageResponse(message="Password has been reset successfully. You may now sign in.")
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/verify", response_model=MessageResponse)
def verify_email(data: VerifyEmailRequest, db: Session = Depends(get_db)):
    try:
        AuthService.verify_email(db, data.token)
        return MessageResponse(message="Email verified successfully.")
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
