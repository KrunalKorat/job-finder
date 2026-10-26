# Job Finder — Phase 1 Implementation Tasks & Architecture

## 1. Project Overview & Architecture Decisions
- **Product Name**: Job Finder
- **Repository Structure**: Monorepo (`frontend/`, `backend/`, `infra/`, `docs/`)
- **Frontend Stack**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, Framer Motion
- **Design System**: Premium off-white (`#F8F7F3`) and blue (`#2563EB`) design system with 8px grid, cards (`#FFFFFF`, radii 12-16px), subtle borders (`#E6E8ED`), high contrast typography
- **Backend Stack**: Python 3.13, FastAPI, SQLAlchemy 2.x, Alembic, Pydantic v2
- **Database & Cache**: PostgreSQL (system of record), Redis (queue coordination & caching)
- **Background Jobs**: Celery workers with Redis broker, capable of graceful degradation if Redis is offline
- **Security & Auth**: Secure cookie-based sessions / JWT with HTTPOnly, SameSite, CSRF protection, plus Bearer header fallback for API clients; password hashing via bcrypt; sensitive log redaction
- **Integration & Automation Philosophy**:
  - Authorized sources only (official career pages, documented APIs like Greenhouse/Lever public job APIs)
  - Zero unauthorized scraping or anti-bot circumvention
  - Automation disabled by default; explicit user consent & limits required
  - Job read access evaluated independently from submission access

---

## 2. Phase 1 Checklist & Progress

### 2.1 Pre-Implementation & Setup
- [x] Workspace inspection (empty root, Node.js 24, Python 3.13, Docker 29, gh CLI authenticated)
- [x] Initialize Git repository (`main` branch)
- [x] Configure root `.gitignore`
- [x] Create `TASKS.md` with complete Phase 1 checklist and acceptance criteria

### 2.2 Backend Foundation (`backend/`)
- [ ] Directory structure setup (`app/core`, `app/api`, `app/db`, `app/models`, `app/schemas`, `app/repositories`, `app/services`, `app/integrations`, `app/tasks`, `tests/`)
- [ ] Requirements specification (`requirements.txt`)
- [ ] Core configuration (`config.py`, Pydantic Settings, environment variables)
- [ ] Structured logging with sensitive field redaction (`logging.py`)
- [ ] Security utilities: password hashing, JWT token creation, cookie handling (`security.py`)
- [ ] Database session & base model definition with SQLAlchemy 2.x (`db/session.py`, `db/base.py`)
- [ ] Phase 1 SQLAlchemy models:
  - [ ] `User` (`users` table)
  - [ ] `UserProfile` (`user_profiles` table)
  - [ ] `CareerPreference` (`career_preferences` table)
  - [ ] `Resume` (`resumes` table)
  - [ ] `AutomationSetting` (`automation_settings` table)
  - [ ] `JobSourceRegistry` (`job_source_registry` table)
  - [ ] Future migration boundaries (`Job`, `Application`, `MatchResult`, `AuditLog`)
- [ ] Alembic setup and initial migration script
- [ ] Pydantic v2 Schemas (Auth, User, Profile, CareerPreference, AutomationSettings, Health)
- [ ] API routes under `/api/v1`:
  - [ ] `/health/live` & `/health/ready`
  - [ ] `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify`
  - [ ] `/users/me`
  - [ ] `/preferences/career` (GET, PUT)
  - [ ] `/automation/settings` (GET, PUT)
- [ ] Job Integration Interfaces (`integrations/job_sources/`, `integrations/application_submissions/`):
  - [ ] `JobSourceAdapter` abstract base class
  - [ ] `JobListingNormalizer`
  - [ ] `ApplicationSubmissionAdapter` abstract base class
  - [ ] `ProviderCapabilityRegistry` with explicit capability tracking (Greenhouse, Lever, Direct)
- [ ] Application Automation Policy (`services/automation_policy.py`) with unit test validation
- [ ] Celery task scaffolding (`tasks/celery_app.py`) with Redis / in-memory fallback

### 2.3 Frontend Foundation (`frontend/`)
- [ ] Next.js 15 App Router initialization with TypeScript & Tailwind CSS
- [ ] Design tokens configuration in `tailwind.config.ts` and `globals.css` (Off-white `#F8F7F3`, Card `#FFFFFF`, Primary `#2563EB`, Navy `#172B4D`, etc.)
- [ ] Reusable UI components (Button, Input, Card, Badge, Modal/Dialog, Skeleton, Alert, StatusIndicator)
- [ ] Typed API Client (`lib/api.ts`) with credentials support, error parsing, and base URL config
- [ ] Auth context and session management hook (`contexts/auth-context.tsx`)
- [ ] Landing Page (`app/page.tsx`):
  - [ ] Top navigation bar with logo, links, auth action buttons
  - [ ] Hero section with "Your Next Opportunity Starts Here", CTAs, interactive dashboard preview
  - [ ] How it works section (4-step visual flow)
  - [ ] Core feature pillars: Resume intelligence, Intelligent matching, Application prep, Privacy & compliance
  - [ ] FAQ accordion
  - [ ] Clean footer with privacy, terms, and contact links
- [ ] Authentication Screens:
  - [ ] Sign In (`app/auth/login/page.tsx`)
  - [ ] Sign Up (`app/auth/register/page.tsx`)
  - [ ] Forgot Password (`app/auth/forgot-password/page.tsx`)
  - [ ] Reset Password (`app/auth/reset-password/page.tsx`)
  - [ ] Email Verification (`app/auth/verify/page.tsx`)
- [ ] Protected Dashboard Shell:
  - [ ] Sidebar layout with active route indicator, collapsible mobile drawer, user profile summary
  - [ ] Overview screen (`app/dashboard/page.tsx`) with genuine onboarding states (upload resume prompt, preference completion tracker, zero-fake metrics)
  - [ ] Career Preferences & Profile screen (`app/dashboard/profile/page.tsx`) with real database persistence
  - [ ] Automation Center (`app/dashboard/automation/page.tsx`) reflecting default disabled policy and controls
  - [ ] Modular placeholders for future modules (Discover, Recommended, Saved, Applications, Documents, Settings)

### 2.4 Infrastructure & Local Development (`infra/`, root)
- [ ] Root `.env.example`, `backend/.env.example`, `frontend/.env.example`
- [ ] Docker Compose (`docker-compose.yml`) for Frontend, Backend, PostgreSQL, Redis, Celery
- [ ] Backend `Dockerfile` and frontend `Dockerfile`
- [ ] Deployment guide (`docs/deployment.md`) documenting low-cost hosting (Neon, Upstash, Vercel, Render) and operational trade-offs

### 2.5 Testing & Quality Assurance
- [ ] Backend test suite (`pytest`):
  - [ ] Registration & authentication flows
  - [ ] Password hashing & security tests
  - [ ] Profile CRUD & career preference validation
  - [ ] Automation policy & limit enforcement
  - [ ] Provider capability registry
  - [ ] Health checks (/health/live and /health/ready)
- [ ] Frontend unit/component tests & build verification
- [ ] End-to-end integration test (Playwright flow):
  - [ ] Visit landing page -> Register user -> View dashboard -> Update career preferences -> Confirm persistence -> Logout -> Confirm protected route redirection
- [ ] Linting and type checking verification (`npm run lint`, `tsc --noEmit`, `mypy`/`pytest`)

### 2.6 GitHub Publication
- [ ] Create remote GitHub repository `job-finder` under `KrunalKorat`
- [ ] Commit all code cleanly
- [ ] Push to `main` branch
- [ ] Update `TASKS.md` with commit hash and status

---

## 3. Acceptance Criteria
1. **Security**: Zero hardcoded credentials; password hashing with bcrypt; secure cookies and strict CORS.
2. **Policy Adherence**: Automation defaults strictly to disabled; rate limits enforced server-side; capabilities cleanly isolated.
3. **UI/UX Excellence**: Cohesive off-white & blue theme; responsive mobile/tablet/desktop; accessible inputs; zero placeholder metrics.
4. **Resilience**: Backend runs with PostgreSQL, handles SQLite for unit testing, and degrades gracefully when Redis/Celery is offline.
5. **Verified Quality**: All automated tests pass with real assertions; build succeeds without errors.
