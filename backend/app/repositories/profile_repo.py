from typing import Optional
from sqlalchemy.orm import Session
from app.models.profile import UserProfile
from app.schemas.profile import UserProfileUpdate


class ProfileRepository:
    @staticmethod
    def get_by_user_id(db: Session, user_id: int) -> Optional[UserProfile]:
        return db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

    @staticmethod
    def upsert(db: Session, user_id: int, data: UserProfileUpdate) -> UserProfile:
        profile = ProfileRepository.get_by_user_id(db, user_id)
        if not profile:
            profile = UserProfile(user_id=user_id)
            db.add(profile)

        update_dict = data.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(profile, key, value)

        # Recalculate profile completion
        fields = [profile.name, profile.professional_headline, profile.location, profile.portfolio_url or profile.linkedin_url]
        filled = sum(1 for f in fields if f)
        if filled == 0:
            profile.profile_completion_status = "incomplete"
        elif filled < len(fields):
            profile.profile_completion_status = "in_progress"
        else:
            profile.profile_completion_status = "complete"

        db.commit()
        db.refresh(profile)
        return profile
