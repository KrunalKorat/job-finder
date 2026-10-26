# Job Finder — Phase 1 Foundation

> AI-assisted job discovery and authorized application management platform built with Next.js, FastAPI, PostgreSQL, Redis, and Celery.

[![Backend Tests](https://img.shields.io/badge/backend%20tests-21%20passed-success)](https://github.com/KrunalKorat/job-finder)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 1. Product Philosophy & Non-Negotiable Guardrails

1. **Authorized Discovery Only**: Jobs are fetched exclusively from official employer career pages, documented ATS job boards (e.g., Greenhouse and Lever public board APIs), and explicitly authorized interfaces.
2. **Zero Scraping & Anti-Bot Circumvention**: We never scrape generic job aggregator websites, bypass CAPTCHAs, violate terms of service, or ignore rate limits.
3. **Decoupled Read & Submission Permissions**: Read access to a job feed does not imply submission permission. Each capability is registered and verified independently.
4. **Automation Disabled by Default**: Automated application submission is strictly off by default. It requires explicit user activation, candidate-approved provider whitelisting, and strict daily/weekly quotas.
5. **No Hallucinated Answers**: If an application requires information not verified in the candidate's profile, it is handed off directly to the candidate for review.
6. **Zero Cost Requirement for Phase 1**: Operates locally with SQLite or PostgreSQL without requiring paid third-party AI APIs.

---

## 2. Monorepo Architecture

```
job-finder/
├── frontend/             # Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
│   ├── app/              # Routes: landing, auth flows, protected dashboard
│   ├── components/       # Design system: buttons, cards, inputs, empty states
│   ├── contexts/         # AuthContext and session state management
│   └── lib/              # Typed API client with credential management
├── backend/              # Python 3.13, FastAPI, SQLAlchemy 2.x, Alembic, Pydantic v2
│   ├── app/
│   │   ├── api/          # API v1 routes (auth, users, preferences, automation, health)
│   │   ├── core/         # Config, security (bcrypt & JWT), structured logging
│   │   ├── db/           # Session, base models, migrations
│   │   ├── integrations/ # Official ATS adapters (Greenhouse, Lever) & capability registry
│   │   ├── models/       # Database models (users, profiles, preferences, automation)
│   │   ├── repositories/ # Database repository patterns
│   │   ├── schemas/      # Pydantic validation schemas
│   │   ├── services/     # Auth service, automation policy engine
│   │   └── tasks/        # Celery background job definition
│   ├── migrations/       # Alembic version migrations
│   └── tests/            # Pytest test suite (21 unit and integration tests)
├── infra/                # Infrastructure configurations
├── docs/                 # Documentation (deployment guide, hosting strategy)
├── docker-compose.yml    # Orchestrates PostgreSQL, Redis, FastAPI, Celery, and Next.js
├── TASKS.md              # Phase 1 task tracker and architecture decisions
└── README.md
```

---

## 3. Local Development Quickstart

### Prerequisites
- Node.js 20+ (Node 24 recommended)
- Python 3.11+ (Python 3.13 recommended)
- Docker & Docker Compose (optional for containerized setup)

### Option A: Docker Compose (All Services)
```bash
# Clone the repository
git clone https://github.com/KrunalKorat/job-finder.git
cd job-finder

# Copy environment variables
cp .env.example .env

# Build and start all services
docker compose up --build
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health/ready](http://localhost:8000/health/ready)

---

### Option B: Native Local Development

#### 1. Start Backend (FastAPI)
```bash
cd backend
python -m venv .venv

# On Windows:
.\.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

#### 2. Start Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000).

---

## 4. Running Tests

### Backend Test Suite (Pytest)
```bash
cd backend
.\.venv\Scripts\pytest -v
```
**Test Coverage Includes**:
- User registration, duplicate checks, login, and password hashing security
- Authorization boundaries on protected endpoints
- Candidate profile CRUD and completion status calculation
- Career preferences validation and structured array constraints
- Strict safety defaults for automation (disabled by default, require approval)
- Comprehensive Automation Policy Engine rule evaluations
- Provider capability registry and Greenhouse/Lever compliance
- Liveness and readiness health checks with sensitive field redaction

### Frontend Verification
```bash
cd frontend
npm run lint
npm run build
```

---

## 5. Security & Secret Hygiene
- Sensitive keys (`password`, `token`, `secret`, `authorization`) are automatically redacted from application logs.
- Sessions use secure HttpOnly cookies with CSRF protection and configurable SameSite flags.
- Zero credentials or tokens are committed to source control.

---

## 6. License
MIT License.
