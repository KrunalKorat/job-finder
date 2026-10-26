def test_get_initial_preferences(client, test_user):
    response = client.get("/api/v1/preferences/career", headers=test_user["headers"])
    assert response.status_code == 200
    data = response.json()
    assert data["matching_threshold"] == 75
    assert data["salary_currency"] == "USD"
    assert isinstance(data["desired_job_titles"], list)
    assert isinstance(data["skills"], list)


def test_update_career_preferences(client, test_user):
    payload = {
        "desired_job_titles": ["Full Stack Engineer", "Senior Backend Developer"],
        "skills": ["Python", "FastAPI", "React", "PostgreSQL", "Docker"],
        "preferred_locations": ["Remote", "New York, NY", "San Francisco, CA"],
        "work_arrangements": ["remote", "hybrid"],
        "employment_types": ["full_time", "contract"],
        "min_salary": 140000,
        "salary_currency": "USD",
        "preferred_industries": ["Technology", "Fintech"],
        "work_authorization_status": "authorized",
        "sponsorship_required": False,
        "excluded_employers": ["BadCorp Inc"],
        "matching_threshold": 85,
    }
    response = client.put("/api/v1/preferences/career", json=payload, headers=test_user["headers"])
    assert response.status_code == 200
    data = response.json()
    assert data["desired_job_titles"] == payload["desired_job_titles"]
    assert data["skills"] == payload["skills"]
    assert data["min_salary"] == 140000
    assert data["matching_threshold"] == 85
    assert data["work_arrangements"] == ["remote", "hybrid"]


def test_update_invalid_work_arrangement(client, test_user):
    payload = {
        "desired_job_titles": ["Engineer"],
        "work_arrangements": ["in_space"],  # Invalid
    }
    response = client.put("/api/v1/preferences/career", json=payload, headers=test_user["headers"])
    assert response.status_code == 422


def test_update_profile_and_completion_status(client, test_user):
    payload = {
        "name": "Alex Applicant Updated",
        "professional_headline": "Senior Full-Stack Engineer",
        "location": "Austin, TX",
        "portfolio_url": "https://alexapplicant.dev",
        "linkedin_url": "https://linkedin.com/in/alexapplicant",
    }
    response = client.put("/api/v1/users/me/profile", json=payload, headers=test_user["headers"])
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Alex Applicant Updated"
    assert data["location"] == "Austin, TX"
    assert data["profile_completion_status"] == "complete"
