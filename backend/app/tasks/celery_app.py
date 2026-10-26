import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

celery_app = None

try:
    from celery import Celery

    broker_url = settings.CELERY_BROKER_URL or settings.REDIS_URL
    result_backend = settings.CELERY_RESULT_BACKEND or settings.REDIS_URL

    celery_app = Celery(
        "jobfinder_tasks",
        broker=broker_url,
        backend=result_backend,
    )

    celery_app.conf.update(
        task_serializer="json",
        accept_content=["json"],
        result_serializer="json",
        timezone="UTC",
        enable_utc=True,
        task_track_started=True,
    )
    logger.info("Celery task runner initialized successfully.")
except Exception as e:
    logger.warning("Celery could not be initialized (standalone / local mode): %s", e)
