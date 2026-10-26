from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr
from app.schemas.profile import UserProfileResponse
from app.schemas.preference import CareerPreferenceResponse
from app.schemas.automation import AutomationSettingResponse


class UserBrief(BaseModel):
    id: int
    email: EmailStr
    is_verified: bool
    status: str
    name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    is_verified: bool
    status: str
    created_at: datetime
    updated_at: datetime
    profile: Optional[UserProfileResponse] = None
    career_preference: Optional[CareerPreferenceResponse] = None
    automation_setting: Optional[AutomationSettingResponse] = None

    model_config = ConfigDict(from_attributes=True)
