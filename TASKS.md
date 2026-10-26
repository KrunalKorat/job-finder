# Job Finder — Phase 1 Implementation Tasks & Architecture

## 1. Project Overview & Architecture Decisions
- **Product Name**: Job Finder
- **Repository**: [https://github.com/KrunalKorat/job-finder](https://github.com/KrunalKorat/job-finder)
- **Monorepo Structure**: `frontend/`, `backend/`, `infra/`, `docs/`, `docker-compose.yml`, `TASKS.md`, `README.md`
- **Frontend Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, Framer Motion
- **Design System**: Premium off-white (`#F8F7F3`) and blue (`#2563EB`) design system with 8px grid, card surfaces (`#FFFFFF`, radii 12-16px), subtle borders (`#E6E8ED`), high contrast typography
- **Backend Stack**: Python 3.13, FastAPI, SQLAlchemy 2.x, Alembic, Pydantic v2
- **Database & Cache**: PostgreSQL (system of record), Redis (queue coordination & caching), SQLite supported for zero-setup local dev/testing
- **Background Jobs**: Celery workers with Redis broker, capable of graceful degradation in standalone mode
- **Security & Auth**: Secure cookie-based sessions with HTTPOnly, SameSite, and CSRF protection, plus Bearer header fallback for API clients; password hashing via bcrypt (rounds=12); sensitive log redaction filter
- **Integration & Automation Philosophy**:
  - Authorized sources only (official employer career pages, documented ATS APIs: Greenhouse & Lever public boards)
  - Zero unauthorized scraping or anti-bot circumvention
  - Automation strictly disabled by default; explicit user consent & rate limits required
  - Job read access evaluated independently from submission access

---

## 2. Phase 1 Checklist & Progress

### 2.1 Pre-Implementation & Setup
- [x] Workspace inspection (Node.js 24, Python 3.13, Docker 29, gh CLI authenticated)
- [x] Initialize Git repository (`main` branch)
- [x] Configure root and frontend `.gitignore` with strict secret/binary hygiene
- [x] Create `TASKS.md` with complete Phase 1 checklist and acceptance criteria
- [x] Create remote repository `KrunalKorat/job-finder` and wire up git origin

### 2.2 Backend Foundation (`backend/`)
- [x] Directory structure setup (`app/core`, `app/api`, `app/db`, `app/models`, `app/schemas`, `app/repositories`, `app/services`, `app/integrations`, `app/tasks`, `tests/`)
- [x] Requirements specification (`requirements.txt`)
- [x] Core configuration with Pydantic BaseSettings (`core/config.py`)
- [x] Structured logging with sensitive field redaction filter (`core/logging.py`)
- [x] Security utilities: bcrypt hashing, JWT access/reset/verification tokens (`core/security.py`)
- [x] Database session & connection pooling (`db/session.py`, `db/base.py`)
- [x] Phase 1 SQLAlchemy models:
  - [x] `User` (`users` table)
  - [x] `UserProfile` (`user_profiles` table)
  - [x] `CareerPreference` (`career_preferences` table with JSON array fields)
  - [x] `Resume` (`resumes` table)
  - [x] `AutomationSetting` (`automation_settings` table, safety defaults strictly False/True)
  - [x] `JobSourceRegistry` (`job_source_registry` table)
  - [x] Future migration boundaries (`Job`, `Application`, `MatchResult`, `AuditLog`, etc.)
- [x] Alembic configuration and initial migration script (`001_initial_phase1_schema.py`)
- [x] Pydantic v2 validation schemas with rate-limit and enum boundary checks
- [x] API routes under `/api/v1`:
  - [x] `/health/live` & `/health/ready` (checks DB and cache without leaking credentials)
  - [x] `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify`
  - [x] `/users/me`, `/users/me/profile`
  - [x] `/preferences/career` (GET, PUT)
  - [x] `/automation/settings` (GET, PUT)
- [x] Job Integration Interfaces (`integrations/job_sources/`, `integrations/application_submissions/`):
  - [x] `JobSourceAdapter` abstract base class
  - [x] `JobListingNormalizer`
  - [x] `ApplicationSubmissionAdapter` abstract base class
  - [x] `ProviderCapabilityRegistry` tracking Greenhouse, Lever, and Direct Portals
- [x] Application Automation Policy Engine (`services/automation_policy.py`) with 8 safety test rules
- [x] Celery task scaffolding (`tasks/celery_app.py`) with standalone fallback

### 2.3 Frontend Foundation (`frontend/`)
- [x] Next.js 16 App Router initialization with React 19, TypeScript, and Tailwind CSS
- [x] Design tokens in `globals.css` (Off-white `#F8F7F3`, Card `#FFFFFF`, Primary `#2563EB`, Navy `#172B4D`, etc.)
- [x] Reusable UI components (`Button`, `Input`, `Card`, `Badge`, `StatusIndicator`, `Skeleton`, `EmptyState`)
- [x] Typed API Client (`lib/api.ts`) with credentials support, error parsing, and base URL config
- [x] Auth context and session management hook (`contexts/auth-context.tsx`)
- [x] Landing Page (`app/page.tsx`):
  - [x] Top navigation bar with logo, links, auth action buttons
  - [x] Hero section with "Your Next Opportunity Starts Here", CTAs, interactive dashboard preview
  - [x] How it works section (4-step visual workflow)
  - [x] Core feature pillars: Resume intelligence, Authorized matching, Server guardrails
  - [x] Privacy and authorized automation manifesto
  - [x] Interactive FAQ accordion
  - [x] Clean footer with compliance and terms notes
- [x] Authentication Screens:
  - [x] Sign In (`app/auth/login/page.tsx`)
  - [x] Sign Up (`app/auth/register/page.tsx`)
  - [x] Forgot Password (`app/auth/forgot-password/page.tsx`)
  - [x] Reset Password (`app/auth/reset-password/page.tsx`)
  - [x] Email Verification Status (`app/auth/verify/page.tsx`)
- [x] Protected Dashboard Shell:
  - [x] Sidebar layout with active route indicator, mobile drawer, user profile summary
  - [x] Overview screen (`app/dashboard/page.tsx`) with genuine onboarding states (zero fake metrics)
  - [x] Career Preferences & Profile screen (`app/dashboard/profile/page.tsx`) with database persistence
  - [x] Automation Center (`app/dashboard/automation/page.tsx`) reflecting default disabled policy and quotas
  - [x] Modular setup states for future modules (Discover, Recommended, Saved, Applications, Documents, Settings)

### 2.4 Infrastructure & Local Development
- [x] Root `.env.example`, `backend/.env.example`, `frontend/.env.example`
- [x] Docker Compose (`docker-compose.yml`) for Frontend, Backend, PostgreSQL, Redis, Celery
- [x] Backend `Dockerfile` and Frontend `Dockerfile`
- [x] Deployment guide (`docs/deployment.md`) documenting low-cost hosting (Neon, Upstash, Vercel, Render) and operational trade-offs
- [x] Root `README.md` with quickstart guides and architecture documentation

---

## 3. Automated Test Results & Verification

### 3.1 Backend Test Suite (Pytest)
Command: `pytest -v` in `backend/`
```
============================= test session starts =============================
platform win32 -- Python 3.13.15, pytest-8.4.2, pluggy-1.7.0
rootdir: C:\Users\Krunal Korat\Desktop\job finder\backend

tests/test_auth.py::test_register_success PASSED                         [  4%]
tests/test_auth.py::test_register_duplicate_email PASSED                 [  9%]
tests/test_auth.py::test_login_success PASSED                            [ 14%]
tests/test_auth.py::test_login_invalid_password PASSED                   [ 19%]
tests/test_auth.py::test_login_nonexistent_user PASSED                   [ 23%]
tests/test_auth.py::test_logout PASSED                                   [ 28%]
tests/test_auth.py::test_password_hashing_security PASSED                [ 33%]
tests/test_auth.py::test_authorization_boundary_unauthenticated PASSED   [ 38%]
tests/test_auth.py::test_get_current_user_authenticated PASSED           [ 42%]
tests/test_automation.py::test_default_automation_settings_safety PASSED [ 47%]
tests/test_automation.py::test_update_automation_settings_valid PASSED   [ 52%]
tests/test_automation.py::test_invalid_limit_daily_greater_than_weekly PASSED [ 57%]
tests/test_automation.py::test_policy_engine_rules PASSED                [ 61%]
tests/test_health.py::test_liveness_check PASSED                         [ 66%]
tests/test_health.py::test_readiness_check PASSED                        [ 71%]
tests/test_integrations.py::test_provider_capability_registry PASSED     [ 76%]
tests/test_integrations.py::test_job_listing_normalizer PASSED           [ 80%]
tests/test_preferences.py::test_get_initial_preferences PASSED           [ 85%]
tests/test_preferences.py::test_update_career_preferences PASSED         [ 90%]
tests/test_preferences.py::test_update_invalid_work_arrangement PASSED   [ 95%]
tests/test_preferences.py::test_update_profile_and_completion_status PASSED [100%]

======================== 21 passed, 1 warning in 6.58s ========================
```

### 3.2 Frontend Build & Linter
Commands: `npm run lint` and `npm run build` in `frontend/`
- ESLint: Exited with code 0 (0 errors, 0 warnings).
- Next.js Build: 18 static routes compiled and prerendered successfully with Turbopack.

### 3.3 End-to-End Test Suite (Playwright)
Command: `npx playwright test` in `frontend/`
```
Running 2 tests using 1 worker

  ok 1 [chromium] › e2e\flow.spec.ts:9:7 › 1. Landing page renders branding, hero headline, and navigation links (232ms)
  ok 2 [chromium] › e2e\flow.spec.ts:17:7 › 2. Full candidate registration, dashboard navigation, preference update, persistence, and logout flow (1.1s)

  2 passed (1.9s)
```

---

## 4. Git Repository Status
- **Commit Hash**: `a069072`
- **Branch**: `main`
- **Remote**: [https://github.com/KrunalKorat/job-finder.git](https://github.com/KrunalKorat/job-finder.git)
- **Status**: Clean working tree, all changes committed and pushed to GitHub.

---

## 5. Known Limitations & Phase 1 Scope Boundaries
- **Resume File Upload**: File parsing, text extraction, and PDF generation are intentionally reserved for Phase 2.
- **Live Job Feed Ingestion**: Provider adapters are fully specified with capability declarations and Greenhouse/Lever endpoints, but scheduled catalog polling is reserved for Phase 3.
- **Background Worker Hosting**: Free hosting tiers (e.g. Render Free web) sleep when idle; persistent 24/7 background worker schedules require a low-cost persistent instance (e.g. Hetzner Cloud or Railway worker service) as documented in `docs/deployment.md`.

---

## 6. Next Recommended Phase (Phase 2)
- **Phase 2 Objectives**:
  - Secure resume upload to S3/Cloudflare R2 storage backend
  - PDF and DOCX text extraction pipeline
  - Structured profile attribute and skill parsing
  - Candidate manual correction and review interface
  - Resume versioning and document metadata tracking
