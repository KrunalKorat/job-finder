from typing import Optional
from sqlalchemy.orm import Session
from app.models.automation import AutomationSetting
from app.schemas.automation import AutomationSettingUpdate


class AutomationRepository:
    @staticmethod
    def get_by_user_id(db: Session, user_id: int) -> Optional[AutomationSetting]:
        return db.query(AutomationSetting).filter(AutomationSetting.user_id == user_id).first()

    @staticmethod
    def upsert(db: Session, user_id: int, data: AutomationSettingUpdate) -> AutomationSetting:
        setting = AutomationRepository.get_by_user_id(db, user_id)
        if not setting:
            setting = AutomationSetting(user_id=user_id)
            db.add(setting)

        update_dict = data.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(setting, key, value)

        db.commit()
        db.refresh(setting)
        return setting
