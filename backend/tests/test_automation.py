from app.models.automation import AutomationSetting
from app.services.automation_policy import AutomationPolicyEngine


def test_default_automation_settings_safety(client, test_user):
    response = client.get("/api/v1/automation/settings", headers=test_user["headers"])
    assert response.status_code == 200
    data = response.json()
    # MANDATORY SAFETY DEFAULTS
    assert data["automation_enabled"] is False
    assert data["require_approval"] is True
    assert data["max_applications_per_day"] == 5
    assert data["max_applications_per_week"] == 20


def test_update_automation_settings_valid(client, test_user):
    payload = {
        "automation_enabled": True,
        "automation_mode": "manual_review",
        "min_match_score": 85,
        "max_applications_per_day": 8,
        "max_applications_per_week": 35,
        "approved_providers": ["greenhouse", "lever"],
        "excluded_employers": ["ToxicCorp", "SpamCo"],
        "require_approval": True,
    }
    response = client.put("/api/v1/automation/settings", json=payload, headers=test_user["headers"])
    assert response.status_code == 200
    data = response.json()
    assert data["automation_enabled"] is True
    assert data["max_applications_per_day"] == 8
    assert data["max_applications_per_week"] == 35
    assert "greenhouse" in data["approved_providers"]


def test_invalid_limit_daily_greater_than_weekly(client, test_user):
    payload = {
        "automation_enabled": True,
        "max_applications_per_day": 30,
        "max_applications_per_week": 20,  # invalid: daily > weekly
    }
    response = client.put("/api/v1/automation/settings", json=payload, headers=test_user["headers"])
    assert response.status_code == 422


def test_policy_engine_rules():
    # 1. Disabled automation
    setting = AutomationSetting(
        automation_enabled=False,
        require_approval=True,
        approved_providers=["greenhouse"],
        excluded_employers=["SpamCo"],
        max_applications_per_day=5,
        max_applications_per_week=20,
    )
    res = AutomationPolicyEngine.evaluate_submission_eligibility(
        setting=setting,
        provider_id="greenhouse",
        company_name="GoodCorp",
        job_location="Remote",
        current_daily_count=0,
        current_weekly_count=0,
    )
    assert res.allowed is False
    assert "disabled" in res.reason.lower()

    # 2. Automation enabled but approval required and not given
    setting.automation_enabled = True
    res = AutomationPolicyEngine.evaluate_submission_eligibility(
        setting=setting,
        provider_id="greenhouse",
        company_name="GoodCorp",
        job_location="Remote",
        current_daily_count=0,
        current_weekly_count=0,
        user_confirmed=False,
    )
    assert res.allowed is False
    assert res.requires_human_handoff is True

    # 3. Provider not in approved whitelist
    res = AutomationPolicyEngine.evaluate_submission_eligibility(
        setting=setting,
        provider_id="unapproved_source",
        company_name="GoodCorp",
        job_location="Remote",
        current_daily_count=0,
        current_weekly_count=0,
        user_confirmed=True,
    )
    assert res.allowed is False
    assert "approved providers" in res.reason.lower()

    # 4. Employer in excluded blacklist
    res = AutomationPolicyEngine.evaluate_submission_eligibility(
        setting=setting,
        provider_id="greenhouse",
        company_name="SpamCo",
        job_location="Remote",
        current_daily_count=0,
        current_weekly_count=0,
        user_confirmed=True,
    )
    assert res.allowed is False
    assert "excluded employers" in res.reason.lower()

    # 5. Daily limit reached
    res = AutomationPolicyEngine.evaluate_submission_eligibility(
        setting=setting,
        provider_id="greenhouse",
        company_name="GoodCorp",
        job_location="Remote",
        current_daily_count=5,
        current_weekly_count=10,
        user_confirmed=True,
    )
    assert res.allowed is False
    assert "daily limit" in res.reason.lower()

    # 6. Duplicate application
    res = AutomationPolicyEngine.evaluate_submission_eligibility(
        setting=setting,
        provider_id="greenhouse",
        company_name="GoodCorp",
        job_location="Remote",
        current_daily_count=1,
        current_weekly_count=2,
        user_confirmed=True,
        already_applied=True,
    )
    assert res.allowed is False
    assert "already been submitted" in res.reason.lower()

    # 7. Uncertain answer never fabricated
    res = AutomationPolicyEngine.evaluate_submission_eligibility(
        setting=setting,
        provider_id="greenhouse",
        company_name="GoodCorp",
        job_location="Remote",
        current_daily_count=1,
        current_weekly_count=2,
        user_confirmed=True,
        has_ambiguous_fields=True,
    )
    assert res.allowed is False
    assert res.requires_human_handoff is True

    # 8. All checks pass
    res = AutomationPolicyEngine.evaluate_submission_eligibility(
        setting=setting,
        provider_id="greenhouse",
        company_name="GoodCorp",
        job_location="Remote",
        current_daily_count=1,
        current_weekly_count=2,
        user_confirmed=True,
    )
    assert res.allowed is True
    assert res.requires_human_handoff is False
