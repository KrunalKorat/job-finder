from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.repositories.automation_repo import AutomationRepository
from app.schemas.automation import AutomationSettingResponse, AutomationSettingUpdate

router = APIRouter(prefix="/automation", tags=["Automation"])


@router.get("/settings", response_model=AutomationSettingResponse)
def get_automation_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve automation settings for the authenticated user."""
    setting = AutomationRepository.get_by_user_id(db, current_user.id)
    if not setting:
        setting = AutomationRepository.upsert(db, current_user.id, AutomationSettingUpdate())
    return setting


@router.put("/settings", response_model=AutomationSettingResponse)
def update_automation_settings(
    data: AutomationSettingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update automation settings for the authenticated user."""
    setting = AutomationRepository.upsert(db, current_user.id, data)
    return setting
