from app.integrations.job_sources.normalizer import JobListingNormalizer
from app.integrations.registry import ProviderCapabilityRegistry


def test_provider_capability_registry():
    # Greenhouse
    gh = ProviderCapabilityRegistry.get_provider("greenhouse")
    assert gh is not None
    assert gh.can_discover_jobs is True
    assert gh.can_submit_applications is False
    assert "developers.greenhouse.io" in gh.documentation_url

    # Lever
    lever = ProviderCapabilityRegistry.get_provider("lever")
    assert lever is not None
    assert lever.can_discover_jobs is True
    assert lever.can_submit_applications is False

    # Official Career Page
    direct = ProviderCapabilityRegistry.get_provider("official_career_page")
    assert direct is not None
    assert direct.can_discover_jobs is True
    assert direct.can_submit_applications is False

    # Helper methods
    assert ProviderCapabilityRegistry.can_discover("greenhouse") is True
    assert ProviderCapabilityRegistry.can_submit("greenhouse") is False
    assert ProviderCapabilityRegistry.can_submit("unknown_provider") is False


def test_job_listing_normalizer():
    # Test work arrangement
    assert JobListingNormalizer.normalize_work_arrangement("San Francisco, CA (Remote)", "") == "remote"
    assert JobListingNormalizer.normalize_work_arrangement("New York, NY", "This is a hybrid position 2 days a week.") == "hybrid"
    assert JobListingNormalizer.normalize_work_arrangement("Chicago, IL", "Full-time onsite in office.") == "onsite"

    # Test employment type
    assert JobListingNormalizer.normalize_employment_type("Software Engineer Intern", "") == "internship"
    assert JobListingNormalizer.normalize_employment_type("Cloud Architect", "6 month contract assignment.") == "contract"
    assert JobListingNormalizer.normalize_employment_type("Senior Backend Engineer", "Full-time opportunity.") == "full_time"

    # Test HTML stripping
    html_desc = "<p>Join our team! We offer <strong>great benefits</strong> and <a href='#'>growth</a>.</p>"
    clean = JobListingNormalizer.strip_html_tags(html_desc)
    assert clean == "Join our team! We offer great benefits and growth."
