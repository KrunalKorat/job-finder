from datetime import datetime
from typing import Any, Dict, List, Optional
import httpx
from app.integrations.job_sources.base import JobSourceAdapter, NormalizedJobListing
from app.integrations.job_sources.normalizer import JobListingNormalizer


class LeverJobSourceAdapter(JobSourceAdapter):
    """
    Authorized adapter for Lever public postings endpoints.
    Reference: https://github.com/lever/postings-api
    """

    @property
    def provider_id(self) -> str:
        return "lever"

    @property
    def provider_name(self) -> str:
        return "Lever Postings API"

    @property
    def documentation_url(self) -> str:
        return "https://github.com/lever/postings-api"

    @property
    def authentication_required(self) -> bool:
        return False

    def _normalize(self, job: Dict[str, Any], company_name: str) -> NormalizedJobListing:
        job_id = str(job.get("id"))
        title = job.get("text", "Untitled Position")
        categories = job.get("categories", {})
        location = categories.get("location") if isinstance(categories, dict) else None
        commitment = categories.get("commitment") if isinstance(categories, dict) else None
        job_url = job.get("hostedUrl", f"https://jobs.lever.co/{company_name}/{job_id}")
        raw_desc = job.get("descriptionPlain", job.get("description", ""))

        return NormalizedJobListing(
            external_id=job_id,
            provider_id=self.provider_id,
            title=title,
            company_name=company_name,
            location=location,
            work_arrangement=JobListingNormalizer.normalize_work_arrangement(location, raw_desc),
            employment_type=commitment or JobListingNormalizer.normalize_employment_type(title, raw_desc),
            description=raw_desc,
            job_url=job_url,
            posted_at=datetime.fromtimestamp(job.get("createdAt", 0) / 1000.0) if job.get("createdAt") else datetime.utcnow(),
            raw_data={"lever_id": job_id},
        )

    async def discover_jobs(self, organization_token: str, limit: int = 50) -> List[NormalizedJobListing]:
        url = f"https://api.lever.co/v0/postings/{organization_token}?mode=json"
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            if resp.status_code != 200:
                return []
            jobs = resp.json()
            if not isinstance(jobs, list):
                return []
            return [self._normalize(j, organization_token) for j in jobs[:limit]]

    async def fetch_job_details(self, organization_token: str, job_id: str) -> Optional[NormalizedJobListing]:
        url = f"https://api.lever.co/v0/postings/{organization_token}/{job_id}"
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            if resp.status_code != 200:
                return None
            return self._normalize(resp.json(), organization_token)

    async def verify_listing_available(self, organization_token: str, job_id: str) -> bool:
        url = f"https://api.lever.co/v0/postings/{organization_token}/{job_id}"
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            return resp.status_code == 200
