from datetime import datetime
from typing import Any, Dict, List, Optional
import httpx
from app.integrations.job_sources.base import JobSourceAdapter, NormalizedJobListing
from app.integrations.job_sources.normalizer import JobListingNormalizer


class GreenhouseJobSourceAdapter(JobSourceAdapter):
    """
    Authorized adapter for Greenhouse public job board endpoints.
    Reference: https://developers.greenhouse.io/job-board.html
    """

    @property
    def provider_id(self) -> str:
        return "greenhouse"

    @property
    def provider_name(self) -> str:
        return "Greenhouse Job Board"

    @property
    def documentation_url(self) -> str:
        return "https://developers.greenhouse.io/job-board.html"

    @property
    def authentication_required(self) -> bool:
        return False

    def _normalize(self, job: Dict[str, Any], company_name: str) -> NormalizedJobListing:
        job_id = str(job.get("id"))
        title = job.get("title", "Untitled Position")
        location = job.get("location", {}).get("name") if isinstance(job.get("location"), dict) else None
        job_url = job.get("absolute_url", f"https://boards.greenhouse.io/{company_name}/jobs/{job_id}")
        raw_content = job.get("content", "")
        clean_desc = JobListingNormalizer.strip_html_tags(raw_content)

        return NormalizedJobListing(
            external_id=job_id,
            provider_id=self.provider_id,
            title=title,
            company_name=company_name,
            location=location,
            work_arrangement=JobListingNormalizer.normalize_work_arrangement(location, clean_desc),
            employment_type=JobListingNormalizer.normalize_employment_type(title, clean_desc),
            description=clean_desc,
            job_url=job_url,
            posted_at=datetime.utcnow(),
            raw_data={"greenhouse_id": job_id},
        )

    async def discover_jobs(self, organization_token: str, limit: int = 50) -> List[NormalizedJobListing]:
        url = f"https://boards-api.greenhouse.io/v1/boards/{organization_token}/jobs"
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, params={"content": "true"})
            if resp.status_code != 200:
                return []
            data = resp.json()
            jobs = data.get("jobs", [])
            return [self._normalize(j, organization_token) for j in jobs[:limit]]

    async def fetch_job_details(self, organization_token: str, job_id: str) -> Optional[NormalizedJobListing]:
        url = f"https://boards-api.greenhouse.io/v1/boards/{organization_token}/jobs/{job_id}"
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, params={"questions": "true"})
            if resp.status_code != 200:
                return None
            return self._normalize(resp.json(), organization_token)

    async def verify_listing_available(self, organization_token: str, job_id: str) -> bool:
        url = f"https://boards-api.greenhouse.io/v1/boards/{organization_token}/jobs/{job_id}"
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            return resp.status_code == 200
