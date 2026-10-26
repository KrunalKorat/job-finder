from datetime import datetime
from typing import List
from pydantic import BaseModel, ConfigDict, Field, model_validator


VALID_AUTOMATION_MODES = {"manual_review", "semi_autonomous", "full_autonomous"}


class AutomationSettingBase(BaseModel):
    automation_enabled: bool = False
    automation_mode: str = Field("manual_review", max_length=50)
    min_match_score: int = Field(80, ge=50, le=100)
    max_applications_per_day: int = Field(5, ge=1, le=50)
    max_applications_per_week: int = Field(20, ge=1, le=250)
    approved_providers: List[str] = Field(default_factory=list)
    excluded_employers: List[str] = Field(default_factory=list)
    require_approval: bool = True

    @model_validator(mode="after")
    def validate_limits(self) -> "AutomationSettingBase":
        if self.max_applications_per_day > self.max_applications_per_week:
            raise ValueError("Daily limit cannot exceed weekly limit.")
        if self.automation_mode not in VALID_AUTOMATION_MODES:
            raise ValueError(f"Invalid automation mode '{self.automation_mode}'. Allowed: {VALID_AUTOMATION_MODES}")
        return self


class AutomationSettingUpdate(AutomationSettingBase):
    pass


class AutomationSettingResponse(AutomationSettingBase):
    id: int
    user_id: int
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
