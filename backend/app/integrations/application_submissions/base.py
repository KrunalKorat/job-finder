from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Dict, Optional


@dataclass
class SubmissionPayload:
    job_id: str
    applicant_name: str
    applicant_email: str
    applicant_phone: Optional[str]
    resume_storage_key: str
    cover_letter: Optional[str]
    answers: Dict[str, Any]
    idempotency_key: str


@dataclass
class SubmissionResult:
    success: bool
    confirmation_number: Optional[str]
    status_message: str
    raw_response: Dict[str, Any]


class ApplicationSubmissionAdapter(ABC):
    """
    Abstract interface for authorized application submissions.
    Crucial Rule: Automatic submissions are only permitted through integrations
    whose documentation and access permissions explicitly authorize programmatic applications.
    """

    @property
    @abstractmethod
    def provider_id(self) -> str:
        pass

    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass

    @property
    @abstractmethod
    def requires_employer_api_key(self) -> bool:
        pass

    @abstractmethod
    async def submit_application(
        self,
        payload: SubmissionPayload,
        credentials: Optional[Dict[str, str]] = None,
    ) -> SubmissionResult:
        """Submits an application through the explicitly authorized partner endpoint."""
        pass

    @abstractmethod
    async def verify_submission_status(
        self,
        confirmation_number: str,
        credentials: Optional[Dict[str, str]] = None,
    ) -> str:
        """Verifies the delivery status of a previously submitted application."""
        pass
