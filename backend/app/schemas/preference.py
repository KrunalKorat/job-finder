from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


VALID_WORK_ARRANGEMENTS = {"remote", "hybrid", "onsite"}
VALID_EMPLOYMENT_TYPES = {"full_time", "contract", "part_time", "internship"}


class CareerPreferenceBase(BaseModel):
    desired_job_titles: List[str] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    preferred_locations: List[str] = Field(default_factory=list)
    work_arrangements: List[str] = Field(default_factory=list)
    employment_types: List[str] = Field(default_factory=list)
    min_salary: Optional[int] = Field(None, ge=0)
    salary_currency: str = Field("USD", min_length=3, max_length=10)
    preferred_industries: List[str] = Field(default_factory=list)
    work_authorization_status: str = Field("authorized", max_length=100)
    sponsorship_required: bool = False
    excluded_employers: List[str] = Field(default_factory=list)
    matching_threshold: int = Field(75, ge=0, le=100)

    @field_validator("work_arrangements")
    def validate_work_arrangements(cls, v: List[str]) -> List[str]:
        for item in v:
            if item.lower() not in VALID_WORK_ARRANGEMENTS:
                raise ValueError(f"Invalid work arrangement '{item}'. Allowed: {VALID_WORK_ARRANGEMENTS}")
        return [item.lower() for item in v]

    @field_validator("employment_types")
    def validate_employment_types(cls, v: List[str]) -> List[str]:
        for item in v:
            if item.lower() not in VALID_EMPLOYMENT_TYPES:
                raise ValueError(f"Invalid employment type '{item}'. Allowed: {VALID_EMPLOYMENT_TYPES}")
        return [item.lower() for item in v]


class CareerPreferenceUpdate(CareerPreferenceBase):
    pass


class CareerPreferenceResponse(CareerPreferenceBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
