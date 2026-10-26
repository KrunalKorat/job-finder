import logging
import json
import re
from typing import Any, Dict


SENSITIVE_KEYS = {
    "password",
    "token",
    "secret",
    "authorization",
    "cookie",
    "access_token",
    "refresh_token",
    "password_hash",
    "api_key",
    "credentials",
    "resume_content",
}

EMAIL_RE = re.compile(r"([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)")


def mask_email(email: str) -> str:
    parts = email.split("@")
    if len(parts) == 2:
        user, domain = parts
        masked_user = user[0] + "***" if len(user) > 1 else "***"
        return f"{masked_user}@{domain}"
    return "***@***"


class SensitiveDataFilter(logging.Filter):
    """Redacts sensitive values from log records."""

    def filter(self, record: logging.LogRecord) -> bool:
        if isinstance(record.msg, str):
            # Mask potential tokens in messages
            if "Bearer " in record.msg:
                record.msg = re.sub(r"Bearer\s+[A-Za-z0-9_\-\.]+", "Bearer [REDACTED]", record.msg)
            # Mask emails in messages if needed
            for match in EMAIL_RE.finditer(record.msg):
                email = match.group(0)
                record.msg = record.msg.replace(email, mask_email(email))
        return True


def redact_sensitive_dict(data: Dict[str, Any]) -> Dict[str, Any]:
    """Recursively redacts sensitive keys in dictionaries."""
    redacted = {}
    for key, value in data.items():
        if key.lower() in SENSITIVE_KEYS:
            redacted[key] = "[REDACTED]"
        elif isinstance(value, dict):
            redacted[key] = redact_sensitive_dict(value)
        elif isinstance(value, list):
            redacted[key] = [
                redact_sensitive_dict(item) if isinstance(item, dict) else item
                for item in value
            ]
        else:
            redacted[key] = value
    return redacted


def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    )
    root_logger = logging.getLogger()
    sensitive_filter = SensitiveDataFilter()
    root_logger.addFilter(sensitive_filter)

    # Suppress verbose loggers if needed
    logging.getLogger("uvicorn.access").addFilter(sensitive_filter)
