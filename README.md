# GoalSync AI ⚡

**Enterprise Goal Management & Performance Intelligence Platform**

> "Align Goals. Empower Performance."

AtomQuest Hackathon 2026 — In-House Goal Setting & Tracking Portal

---

## 🚀 Live Demo

| Link | URL |
|------|-----|
| 🌐 Frontend (Vercel) | https://goalsync-ai.vercel.app |
| ⚙️ Backend API (Render) | https://goalsync-api.onrender.com |

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Employee | employee@goalsync.ai | demo1234 |
| Manager | manager@goalsync.ai | demo1234 |
| Admin | admin@goalsync.ai | demo1234 |

---

## ✅ Features Implemented

### Phase 1 — Goal Creation & Approval
- Employee goal sheet with Thrust Area, Title, UoM, Target, Weightage
- Live weightage progress bar
- Validation: total = 100%, min 10% per goal, max 8 goals
- Manager L1 approval workflow with inline editing
- Goal locking after approval
- Shared Goals — Admin pushes KPIs; employees can only adjust weightage

### Phase 2 — Achievement Tracking & Check-ins
- Quarterly check-in interface (Q1–Q4) with Planned vs Actual
- Status: Not Started / On Track / Completed
- Progress score engine:
  - **Min** (higher better): Achievement ÷ Target
  - **Max** (lower better): Target ÷ Achievement
  - **Timeline**: Completion vs Deadline
  - **Zero-based**: 0 → 100%, else 0%
- Manager team check-in dashboard + structured comments

### Reporting & Governance
- Audit Trail — every post-lock change logged with old/new values
- Export to Excel (achievement report, audit log)
- Real-time completion dashboard
- QoQ trend charts, dept heatmaps

### Bonus
- AI-powered insights (rule-based, per role)
- Toast notifications
- Activity timeline

---

## 🏗 Architecture

```
React Frontend (Vercel)
    ↓ REST API calls
FastAPI Backend (Render)
    ↓
PostgreSQL / Supabase  +  Analytics Engine
```

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Charts | Recharts |
| Backend | FastAPI (Python) |
| Database | PostgreSQL (Supabase) |
| ORM | SQLAlchemy |
| Auth | JWT |
| Export | SheetJS |
| Deploy Frontend | Vercel |
| Deploy Backend | Render |
| CI | GitHub Actions |

---

## 📁 Structure

```
goalsync-ai/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── employee/
│   │   │   ├── manager/
│   │   │   └── admin/
│   │   ├── context/
│   │   └── data/       # Mock data (works without backend)
│   └── vercel.json
├── backend/           # FastAPI
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── auth/
│   │   └── database/
│   └── Dockerfile
├── .github/workflows/ # CI
├── docker-compose.yml
└── README.md
```

---

## ⚡ Quick Start

### Frontend (works standalone with mock data)
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
# → http://localhost:8000
```

### Full stack (Docker)
```bash
docker-compose up
```

---

## 🚀 Deployment

### Frontend → Vercel
1. Push repo to GitHub
2. Go to vercel.com → New Project → Import repo
3. Set Root Directory: `frontend`
4. Deploy — done!

### Backend → Render
1. New Web Service → Connect GitHub repo
2. Root Directory: `backend`
3. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
4. Add env vars: `DATABASE_URL`, `SECRET_KEY`

### Database → Supabase
1. Create project at supabase.com
2. Copy the connection string to `DATABASE_URL`

---

## 💰 Cost Optimisation

- Vercel (free tier) — frontend, global CDN, auto-deploy
- Render (free tier) — backend container
- Supabase (free tier) — PostgreSQL 500MB
- **Total hosting cost: ₹0/month**

---

## 👤 Team

Individual Participation — AtomQuest 2026
