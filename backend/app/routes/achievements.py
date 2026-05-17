from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database.session import get_db
from app.models.models import Achievement, Goal, AuditLog, User
from app.auth.utils import get_current_user

router = APIRouter()

class AchievementUpsert(BaseModel):
    goal_id: int
    quarter: str
    planned: float
    actual: float
    status: str
    comment: Optional[str] = ""

def compute_progress(goal: Goal, actual: float) -> float:
    if goal.uom == "zero":   return 100.0 if actual == 0 else 0.0
    if goal.uom == "max":    return min((goal.target_value / actual) * 100, 150) if actual else 0
    if goal.uom == "timeline": return 100.0 if actual == 1 else 0.0
    return min((actual / goal.target_value) * 100, 150) if goal.target_value else 0

@router.get("")
def get_achievements(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == "employee":
        goal_ids = [g.id for g in db.query(Goal).filter(Goal.employee_id == current_user.id).all()]
        return db.query(Achievement).filter(Achievement.goal_id.in_(goal_ids)).all()
    return db.query(Achievement).all()

@router.post("")
def upsert_achievement(data: AchievementUpsert, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = db.query(Goal).filter(Goal.id == data.goal_id).first()
    progress = round(compute_progress(goal, data.actual), 2) if goal else 0
    existing = db.query(Achievement).filter(Achievement.goal_id == data.goal_id, Achievement.quarter == data.quarter).first()
    if existing:
        for k, v in data.dict().items(): setattr(existing, k, v)
        existing.progress = progress
    else:
        db.add(Achievement(**data.dict(), progress=progress))
    db.commit()
    return {"message": "Saved", "progress": progress}
