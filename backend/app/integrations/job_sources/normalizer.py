import re
from typing import Optional


class JobListingNormalizer:
    """Normalizes raw ATS and official job descriptions and metadata."""

    @staticmethod
    def normalize_work_arrangement(location: Optional[str], text: Optional[str]) -> Optional[str]:
        haystack = f"{location or ''} {text or ''}".lower()
        if "remote" in haystack:
            return "remote"
        if "hybrid" in haystack:
            return "hybrid"
        if "on-site" in haystack or "onsite" in haystack or "in-office" in haystack:
            return "onsite"
        return None

    @staticmethod
    def normalize_employment_type(title: str, text: Optional[str]) -> Optional[str]:
        haystack = f"{title} {text or ''}".lower()
        if "intern" in haystack or "internship" in haystack:
            return "internship"
        if "contract" in haystack or "contractor" in haystack:
            return "contract"
        if "part-time" in haystack or "part time" in haystack:
            return "part_time"
        return "full_time"

    @staticmethod
    def strip_html_tags(text: Optional[str]) -> str:
        if not text:
            return ""
        clean = re.compile("<.*?>")
        return re.sub(clean, "", text).strip()
