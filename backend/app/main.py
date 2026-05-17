from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Database
from app.database.session import engine

# Models
from app.models.models import Base

# Routes
from app.routes import auth, goals, achievements, analytics, audit

# ---------------------------------------------------
# CREATE DATABASE TABLES AUTOMATICALLY
# ---------------------------------------------------
Base.metadata.create_all(bind=engine)

# ---------------------------------------------------
# FASTAPI APP
# ---------------------------------------------------
app = FastAPI(
    title="GoalSync AI API",
    description="AI-powered Goal Management & Employee Performance Platform",
    version="1.0.0"
)

# ---------------------------------------------------
# CORS CONFIGURATION
# ---------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------
# ROOT ROUTE
# ---------------------------------------------------
@app.get("/")
def root():
    return {
        "message": "GoalSync AI Backend Running Successfully 🚀"
    }

# ---------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------
@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

# ---------------------------------------------------
# ROUTES
# ---------------------------------------------------
app.include_router(auth.router, prefix="/auth", tags=["Auth"])

app.include_router(goals.router, prefix="/goals", tags=["Goals"])

app.include_router(
    achievements.router,
    prefix="/achievements",
    tags=["Achievements"]
)

app.include_router(
    analytics.router,
    prefix="/analytics",
    tags=["Analytics"]
)

app.include_router(
    audit.router,
    prefix="/audit",
    tags=["Audit"]
)