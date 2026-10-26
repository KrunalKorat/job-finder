from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.repositories.profile_repo import ProfileRepository
from app.schemas.profile import UserProfileResponse, UserProfileUpdate
from app.schemas.user import UserResponse

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Returns the authenticated user's complete profile and settings."""
    db.refresh(current_user)
    return current_user


@router.put("/me/profile", response_model=UserProfileResponse)
def update_current_user_profile(
    data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Updates the authenticated user's professional profile."""
    profile = ProfileRepository.upsert(db, current_user.id, data)
    return profile
