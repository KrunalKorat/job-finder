from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.repositories.preference_repo import PreferenceRepository
from app.schemas.preference import CareerPreferenceResponse, CareerPreferenceUpdate

router = APIRouter(prefix="/preferences", tags=["Preferences"])


@router.get("/career", response_model=CareerPreferenceResponse)
def get_career_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve career preferences for the authenticated user."""
    pref = PreferenceRepository.get_by_user_id(db, current_user.id)
    if not pref:
        pref = PreferenceRepository.upsert(db, current_user.id, CareerPreferenceUpdate())
    return pref


@router.put("/career", response_model=CareerPreferenceResponse)
def update_career_preferences(
    data: CareerPreferenceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update career preferences for the authenticated user."""
    pref = PreferenceRepository.upsert(db, current_user.id, data)
    return pref
