import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.db.session import SessionLocal
from app.models.user import User
from app.models.profile import UserProfile
from app.models.automation import AutomationSetting
from app.models.preference import CareerPreference
from app.models.resume import Resume
from app.core.security import hash_password


def init_personal_user(email: str = None, password: str = None, name: str = "Job Finder Owner"):
    email = email or os.getenv("ADMIN_EMAIL", "krunal@jobfinder.io")
    password = password or os.getenv("ADMIN_PASSWORD", "JobFinder2026!")


    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"User {email} already exists (ID: {user.id}).")
            return user.id

        hashed = hash_password(password)
        new_user = User(
            email=email,
            password_hash=hashed,
            status="active",
            is_verified=True,
        )
        db.add(new_user)

        db.commit()
        db.refresh(new_user)

        # Create Profile
        profile = UserProfile(
            user_id=new_user.id,
            name=name,
            professional_headline="Senior Software Engineer",
            location="Remote / Hybrid",
            profile_completion_status="complete",
        )
        db.add(profile)

        # Create Career Preferences
        preferences = CareerPreference(
            user_id=new_user.id,
            desired_job_titles=["Senior Full Stack Engineer", "Staff Backend Engineer", "AI Solutions Architect"],
            skills=["TypeScript", "React", "Python", "FastAPI", "PostgreSQL", "Docker", "Three.js"],
            preferred_locations=["Remote", "New York, NY", "San Francisco, CA"],
            work_arrangements=["remote", "hybrid"],
            employment_types=["full_time"],
            min_salary=150000,
            salary_currency="USD",
            preferred_industries=["Technology", "AI & ML", "Fintech"],
            sponsorship_required=False,
        )
        db.add(preferences)


        # Create Automation Settings
        automation = AutomationSetting(
            user_id=new_user.id,
            automation_enabled=False,
            automation_mode="manual_review",
            min_match_score=80,
            max_applications_per_day=5,
            max_applications_per_week=20,
            approved_providers=["greenhouse", "lever"],
            excluded_employers=["Staffing Corp", "Unverified Aggregators"],
            require_approval=True,
        )
        db.add(automation)

        db.commit()
        print(f"Personal account successfully initialized: {email} (ID: {new_user.id})")
        return new_user.id
    finally:
        db.close()


if __name__ == "__main__":
    init_personal_user()
