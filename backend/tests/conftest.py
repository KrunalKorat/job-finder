import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

os.environ["ENVIRONMENT"] = "testing"
os.environ["SECRET_KEY"] = "test-secret-key-32-characters-long-minimum!"

from app.core.config import settings
from app.db.base import Base
from app.db.session import get_db
from app.main import app

# In-memory SQLite database for testing
TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(client):
    register_payload = {
        "email": "testuser@example.com",
        "password": "SecurePassword123!",
        "name": "Alex Applicant",
    }
    response = client.post("/api/v1/auth/register", json=register_payload)
    data = response.json()
    return {
        "email": register_payload["email"],
        "password": register_payload["password"],
        "user_id": data["user_id"],
        "access_token": data["access_token"],
        "headers": {"Authorization": f"Bearer {data['access_token']}"},
    }
