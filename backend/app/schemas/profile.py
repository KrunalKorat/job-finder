from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, HttpUrl


class UserProfileBase(BaseModel):
    name: Optional[str] = None
    professional_headline: Optional[str] = None
    location: Optional[str] = None
    portfolio_url: Optional[str] = None
    linkedin_url: Optional[str] = None


class UserProfileUpdate(UserProfileBase):
    pass


class UserProfileResponse(UserProfileBase):
    id: int
    user_id: int
    profile_completion_status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
