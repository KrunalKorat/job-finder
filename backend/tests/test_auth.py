from app.core.security import verify_password


def test_register_success(client):
    payload = {
        "email": "newcandidate@example.com",
        "password": "StrongPassword2026!",
        "name": "Jane Doe",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newcandidate@example.com"
    assert "access_token" in data
    assert data["name"] == "Jane Doe"
    assert "jf_session" in response.cookies


def test_register_duplicate_email(client):
    payload = {
        "email": "duplicate@example.com",
        "password": "StrongPassword2026!",
        "name": "First User",
    }
    res1 = client.post("/api/v1/auth/register", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/api/v1/auth/register", json=payload)
    assert res2.status_code == 400
    assert "already exists" in res2.json()["detail"]


def test_login_success(client, test_user):
    payload = {
        "email": test_user["email"],
        "password": test_user["password"],
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["access_token"] == test_user["access_token"] or len(data["access_token"]) > 20
    assert data["email"] == test_user["email"]


def test_login_invalid_password(client, test_user):
    payload = {
        "email": test_user["email"],
        "password": "WrongPassword123!",
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]


def test_login_nonexistent_user(client):
    payload = {
        "email": "nobody@example.com",
        "password": "Password123!",
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 401
    # Generic error message to prevent account enumeration
    assert "Invalid email or password" in response.json()["detail"]


def test_logout(client):
    response = client.post("/api/v1/auth/logout")
    assert response.status_code == 200
    assert "Successfully signed out" in response.json()["message"]


def test_password_hashing_security():
    from app.core.security import hash_password
    pw = "SuperSecretPassword123!"
    h1 = hash_password(pw)
    h2 = hash_password(pw)
    assert h1 != h2  # unique salts
    assert verify_password(pw, h1) is True
    assert verify_password("wrong", h1) is False


def test_authorization_boundary_unauthenticated(client):
    # Accessing protected /users/me without token should return 401
    response = client.get("/api/v1/users/me")
    assert response.status_code == 401


def test_get_current_user_authenticated(client, test_user):
    response = client.get("/api/v1/users/me", headers=test_user["headers"])
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user["email"]
    assert "profile" in data
    assert "career_preference" in data
    assert "automation_setting" in data
