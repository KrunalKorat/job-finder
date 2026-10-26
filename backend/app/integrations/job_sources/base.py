from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional


@dataclass
class NormalizedJobListing:
    external_id: str
    provider_id: str
    title: str
    company_name: str
    location: Optional[str]
    work_arrangement: Optional[str]  # remote, hybrid, onsite
    employment_type: Optional[str]   # full_time, contract, etc.
    description: Optional[str]
    job_url: str
    posted_at: Optional[datetime] = None
    raw_data: Dict[str, Any] = field(default_factory=dict)


class JobSourceAdapter(ABC):
    """
    Abstract interface for authorized job discovery adapters.
    Each adapter accesses official endpoints according to their documented terms.
    """

    @property
    @abstractmethod
    def provider_id(self) -> str:
        """Unique identifier for this provider (e.g. 'greenhouse', 'lever')."""
        pass

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Human-readable provider name."""
        pass

    @property
    @abstractmethod
    def documentation_url(self) -> str:
        """Official documentation URL for the provider API."""
        pass

    @property
    @abstractmethod
    def authentication_required(self) -> bool:
        """Whether reading public job listings requires API authentication."""
        pass

    @abstractmethod
    async def discover_jobs(self, organization_token: str, limit: int = 50) -> List[NormalizedJobListing]:
        """Discovers active listings for an authorized organization."""
        pass

    @abstractmethod
    async def fetch_job_details(self, organization_token: str, job_id: str) -> Optional[NormalizedJobListing]:
        """Fetches detailed specifications for a specific job."""
        pass

    @abstractmethod
    async def verify_listing_available(self, organization_token: str, job_id: str) -> bool:
        """Verifies whether a listing remains active and accepting applications."""
        pass
