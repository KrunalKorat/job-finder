from typing import Optional
from sqlalchemy.orm import Session
from app.models.preference import CareerPreference
from app.schemas.preference import CareerPreferenceUpdate


class PreferenceRepository:
    @staticmethod
    def get_by_user_id(db: Session, user_id: int) -> Optional[CareerPreference]:
        return db.query(CareerPreference).filter(CareerPreference.user_id == user_id).first()

    @staticmethod
    def upsert(db: Session, user_id: int, data: CareerPreferenceUpdate) -> CareerPreference:
        pref = PreferenceRepository.get_by_user_id(db, user_id)
        if not pref:
            pref = CareerPreference(user_id=user_id)
            db.add(pref)

        update_dict = data.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(pref, key, value)

        db.commit()
        db.refresh(pref)
        return pref
