# Low-Cost Hosting and Deployment Architecture

## 1. Overview
Job Finder Phase 1 is engineered to operate on zero-to-low hosting budgets during development and demonstration, while maintaining a clear upgrade path for production-grade persistent background workers.

---

## 2. Recommended Cloud Providers (Free & Low-Cost Tiers)

| Component | Recommended Free / Low-Cost Tier | Key Limitations & Behaviors |
| :--- | :--- | :--- |
| **Frontend** | **Vercel Hobby** (Free) | Static & edge Next.js SSR. Instant deployments, custom domains, HTTPS. |
| **Backend API** | **Render Free** / **Koyeb Free** | Sleeps after 15 minutes of inactivity; 30-50s cold start on wake. |
| **Database** | **Neon Free Tier** (PostgreSQL) | 0.5 GB storage, autosuspends after 5 min. Supports connection pooling. |
| **Queue / Cache**| **Upstash Redis** (Serverless Free) | 10,000 commands/day free. Does not sleep, perfect for serverless rate limiting. |
| **Resume Storage**| **Cloudflare R2** (S3 Compatible) | 10 GB free storage, **$0 egress fees**. Persistent across deployments. |
| **Background Workers**| Local Docker or **Hetzner / Railway** ($5/mo) | Free tiers do **not** support 24/7 background worker processes. |

---

## 3. Operational Trade-Offs & Critical Realities

### 3.1 Background Worker Sleeping on Free Hosts
- **The Issue**: Free app instances (such as Render Free web services) sleep when no HTTP requests arrive. Long-running Celery background workers and Celery Beat schedulers cannot run continuously on sleeping free tiers.
- **Job Finder Solution**:
  - The backend runs cleanly in standalone mode without Celery or Redis for basic candidate registration, profile setup, and health checks.
  - Job discovery and policy checks can be triggered synchronously via manual API calls during development.
  - For continuous 24/7 automated synchronization, a dedicated low-cost persistent host ($4–$5/month Hetzner Cloud or DigitalOcean Droplet) running Docker Compose is required.

### 3.2 Storage Persistence: Never Use Local Container Files
- In Docker containers on serverless or ephemeral platforms, any file saved to local disk is destroyed when the container redeploys or restarts.
- Resumes must be stored in an S3-compatible object store (e.g., Cloudflare R2 or AWS S3), using the `storage_key` reference saved in the PostgreSQL `resumes` table.

### 3.3 Database Cold Starts
- Neon Free instances sleep after 5 minutes of inactivity. When waking from sleep, initial queries can experience a 1.5–2.5 second cold start delay. Connection pooling (`pool_pre_ping=True`) is enabled in SQLAlchemy to handle auto-reconnects seamlessly.

---

## 4. Verification and Health Checks

### Liveness Probe
```bash
curl -X GET https://api.yourdomain.com/health/live
# Expected: {"status": "ok", "timestamp": "..."}
```

### Readiness Probe (Database & Cache Connectivity)
```bash
curl -X GET https://api.yourdomain.com/health/ready
# Expected:
# {
#   "status": "ready",
#   "timestamp": "...",
#   "dependencies": {
#     "database": {"status": "healthy", "latency_ms": 1.4},
#     "redis": {"status": "healthy", "latency_ms": 0.8}
#   }
# }
```

---

## 5. Deployment Step-by-Step

### Step 1: Provision Managed PostgreSQL (Neon)
1. Sign up at [neon.tech](https://neon.tech) and create a project named `jobfinder`.
2. Copy the pooled connection string (`postgresql://username:password@ep-...pooler.neon.tech/jobfinder?sslmode=require`).

### Step 2: Provision Serverless Redis (Upstash)
1. Sign up at [upstash.com](https://upstash.com) and create a Redis database.
2. Copy the `rediss://...` connection URL.

### Step 3: Deploy Backend (FastAPI on Render or Railway)
1. Link your GitHub repository `KrunalKorat/job-finder`.
2. Set Root Directory to `backend`.
3. Set Build Command to `pip install -r requirements.txt`.
4. Set Start Command to `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000`.
5. Add Environment Variables:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string.
   - `REDIS_URL`: Your Upstash Redis connection string.
   - `SECRET_KEY`: Random 32+ character string.
   - `ENVIRONMENT`: `production`.
   - `COOKIE_SECURE`: `true`.
   - `BACKEND_CORS_ORIGINS`: `["https://your-frontend.vercel.app"]`.

### Step 4: Deploy Frontend (Next.js on Vercel)
1. Import repository in [vercel.com](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Configure Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g. `https://jobfinder-api.onrender.com`).
4. Deploy.
