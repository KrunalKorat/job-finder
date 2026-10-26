def test_liveness_check(client):
    response = client.get("/health/live")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "timestamp" in data


def test_readiness_check(client):
    response = client.get("/health/ready")
    assert response.status_code in (200, 503)
    data = response.json()
    assert "status" in data
    assert "dependencies" in data
    assert "database" in data["dependencies"]
    assert data["dependencies"]["database"]["status"] == "healthy"
    # Verify no credentials or secret keys are exposed
    json_str = response.text.lower()
    assert "password" not in json_str
    assert "secret" not in json_str
