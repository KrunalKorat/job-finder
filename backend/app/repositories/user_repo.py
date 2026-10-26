from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.profile import UserProfile
from app.models.preference import CareerPreference
from app.models.automation import AutomationSetting


class UserRepository:
    @staticmethod
    def get_by_id(db: Session, user_id: int) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email.lower().strip()).first()

    @staticmethod
    def create(db: Session, email: str, password_hash: str, name: Optional[str] = None) -> User:
        user = User(
            email=email.lower().strip(),
            password_hash=password_hash,
            is_verified=False,
            status="active",
        )
        db.add(user)
        db.flush()  # assign user.id

        # Automatically initialize associated profile, preferences, and automation settings
        profile = UserProfile(
            user_id=user.id,
            name=name,
            profile_completion_status="incomplete",
        )
        db.add(profile)

        pref = CareerPreference(
            user_id=user.id,
            desired_job_titles=[],
            skills=[],
            preferred_locations=[],
            work_arrangements=[],
            employment_types=[],
            preferred_industries=[],
            excluded_employers=[],
        )
        db.add(pref)

        automation = AutomationSetting(
            user_id=user.id,
            automation_enabled=False,  # strictly False by default
            automation_mode="manual_review",
            require_approval=True,     # strictly True by default
            approved_providers=[],
            excluded_employers=[],
        )
        db.add(automation)

        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def update_verification(db: Session, user: User, is_verified: bool = True) -> User:
        user.is_verified = is_verified
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def update_password(db: Session, user: User, new_password_hash: str) -> User:
        user.password_hash = new_password_hash
        db.commit()
        db.refresh(user)
        return user
