from dataclasses import dataclass
from typing import List, Optional, Set
from app.models.automation import AutomationSetting


@dataclass
class EvaluationResult:
    allowed: bool
    reason: str
    requires_human_handoff: bool = False
    details: Optional[dict] = None


class AutomationPolicyEngine:
    """Enforces server-side guardrails and rules for automated job interactions."""

    @staticmethod
    def evaluate_submission_eligibility(
        setting: AutomationSetting,
        provider_id: str,
        company_name: str,
        job_location: Optional[str],
        current_daily_count: int,
        current_weekly_count: int,
        user_confirmed: bool = False,
        already_applied: bool = False,
        has_ambiguous_fields: bool = False,
        provider_is_healthy: bool = True,
    ) -> EvaluationResult:
        """
        Evaluates whether an application can be automatically submitted
        under strict compliance rules.
        """
        # Rule 1: Master kill-switch check
        if not setting.automation_enabled:
            return EvaluationResult(
                allowed=False,
                reason="Automation is disabled in user settings.",
                requires_human_handoff=True,
            )

        # Rule 2: Require approval check
        if setting.require_approval and not user_confirmed:
            return EvaluationResult(
                allowed=False,
                reason="User approval is required for this application before submission.",
                requires_human_handoff=True,
            )

        # Rule 3: Approved provider whitelist check
        approved_providers: Set[str] = set(p.lower() for p in (setting.approved_providers or []))
        if provider_id.lower() not in approved_providers:
            return EvaluationResult(
                allowed=False,
                reason=f"Provider '{provider_id}' is not in the user's approved providers whitelist.",
                requires_human_handoff=True,
            )

        # Rule 4: Excluded employer blacklist check
        excluded_companies: Set[str] = set(c.lower().strip() for c in (setting.excluded_employers or []))
        if company_name.lower().strip() in excluded_companies:
            return EvaluationResult(
                allowed=False,
                reason=f"Employer '{company_name}' is in the user's excluded employers list.",
                requires_human_handoff=False,
            )

        # Rule 5: Daily rate limit enforcement
        if current_daily_count >= setting.max_applications_per_day:
            return EvaluationResult(
                allowed=False,
                reason=f"Daily limit reached ({current_daily_count}/{setting.max_applications_per_day}).",
                requires_human_handoff=False,
            )

        # Rule 6: Weekly rate limit enforcement
        if current_weekly_count >= setting.max_applications_per_week:
            return EvaluationResult(
                allowed=False,
                reason=f"Weekly limit reached ({current_weekly_count}/{setting.max_applications_per_week}).",
                requires_human_handoff=False,
            )

        # Rule 7: Duplicate prevention check
        if already_applied:
            return EvaluationResult(
                allowed=False,
                reason="Application has already been submitted for this position.",
                requires_human_handoff=False,
            )

        # Rule 8: Never fabricate uncertain answers - require human handoff
        if has_ambiguous_fields:
            return EvaluationResult(
                allowed=False,
                reason="Application requires information not present with certainty in profile.",
                requires_human_handoff=True,
            )

        # Rule 9: Provider outage handling
        if not provider_is_healthy:
            return EvaluationResult(
                allowed=False,
                reason="Provider integration is reporting unhealthy or temporary outage.",
                requires_human_handoff=True,
            )

        return EvaluationResult(
            allowed=True,
            reason="All automation safety policy checks passed.",
            requires_human_handoff=False,
        )
