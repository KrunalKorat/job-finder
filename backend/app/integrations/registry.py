from dataclasses import dataclass
from typing import Dict, List, Optional


@dataclass(frozen=True)
class ProviderCapability:
    provider_id: str
    provider_name: str
    documentation_url: str
    integration_type: str  # ats_public_board, official_api, career_page
    can_discover_jobs: bool
    can_fetch_details: bool
    can_verify_availability: bool
    can_submit_applications: bool
    can_verify_outcome: bool
    rate_limit_per_minute: int
    requires_credentials: bool
    terms_summary: str


class ProviderCapabilityRegistry:
    """
    Central registry documenting verified technical and legal capabilities of job sources.
    Crucial Rule: Job listing access and application submission access are assessed independently.
    """

    _REGISTRY: Dict[str, ProviderCapability] = {
        "greenhouse": ProviderCapability(
            provider_id="greenhouse",
            provider_name="Greenhouse Job Board API",
            documentation_url="https://developers.greenhouse.io/job-board.html",
            integration_type="ats_public_board",
            can_discover_jobs=True,
            can_fetch_details=True,
            can_verify_availability=True,
            can_submit_applications=False,  # Public boards DO NOT authorize programmatic application submissions
            can_verify_outcome=False,
            rate_limit_per_minute=60,
            requires_credentials=False,
            terms_summary="Public read-only GET requests for jobs. Submissions require authenticated Harvest API partner access.",
        ),
        "lever": ProviderCapability(
            provider_id="lever",
            provider_name="Lever Postings API",
            documentation_url="https://github.com/lever/postings-api",
            integration_type="ats_public_board",
            can_discover_jobs=True,
            can_fetch_details=True,
            can_verify_availability=True,
            can_submit_applications=False,  # Submission is not authorized on public endpoints without partner token
            can_verify_outcome=False,
            rate_limit_per_minute=60,
            requires_credentials=False,
            terms_summary="Public read-only access for published jobs. Submissions must be handled manually or via authenticated employer integrations.",
        ),
        "official_career_page": ProviderCapability(
            provider_id="official_career_page",
            provider_name="Direct Official Employer Career Pages",
            documentation_url="https://jobfinder.local/docs/integrations/direct-career-pages",
            integration_type="career_page",
            can_discover_jobs=True,
            can_fetch_details=True,
            can_verify_availability=True,
            can_submit_applications=False,
            can_verify_outcome=False,
            rate_limit_per_minute=30,
            requires_credentials=False,
            terms_summary="Public career site feeds (JSON/RSS/Sitemap). Form submission bots are strictly prohibited.",
        ),
    }

    @classmethod
    def get_provider(cls, provider_id: str) -> Optional[ProviderCapability]:
        return cls._REGISTRY.get(provider_id.lower())

    @classmethod
    def list_all_providers(cls) -> List[ProviderCapability]:
        return list(cls._REGISTRY.values())

    @classmethod
    def can_submit(cls, provider_id: str) -> bool:
        prov = cls.get_provider(provider_id)
        return prov.can_submit_applications if prov else False

    @classmethod
    def can_discover(cls, provider_id: str) -> bool:
        prov = cls.get_provider(provider_id)
        return prov.can_discover_jobs if prov else False
