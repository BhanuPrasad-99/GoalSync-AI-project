from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database.session import get_db
from app.models.models import Goal, Achievement, AuditLog, User
from app.auth.utils import get_current_user, require_role

# ── GOALS ─────────────────────────────────────────────────────────
router = APIRouter()

class GoalCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    thrust_area: str
    uom: str
    target_value: float
    weightage: float

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    target_value: Optional[float] = None
    weightage: Optional[float] = None
    status: Optional[str] = None

def log_action(db, user_id, action, entity, old_val=None, new_val=None):
    db.add(AuditLog(user_id=user_id, action=action, entity=entity, old_value=str(old_val) if old_val else None, new_value=str(new_val) if new_val else None))

@router.get("")
def get_goals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == "employee":
        return db.query(Goal).filter(Goal.employee_id == current_user.id).all()
    if current_user.role == "manager":
        team_ids = [u.id for u in db.query(User).filter(User.manager_id == current_user.id).all()]
        return db.query(Goal).filter(Goal.employee_id.in_(team_ids)).all()
    return db.query(Goal).all()

@router.post("")
def create_goal(data: GoalCreate, db: Session = Depends(get_db), current_user: User = Depends(require_role("employee"))):
    existing = db.query(Goal).filter(Goal.employee_id == current_user.id).count()
    if existing >= 8:
        raise HTTPException(400, "Maximum 8 goals per employee")
    if data.weightage < 10:
        raise HTTPException(400, "Minimum weightage is 10%")
    goal = Goal(**data.dict(), employee_id=current_user.id)
    db.add(goal); db.commit(); db.refresh(goal)
    log_action(db, current_user.id, "Goal Created", f"Goal: {goal.title}", new_val=goal.title)
    db.commit()
    return goal

@router.put("/{goal_id}")
def update_goal(goal_id: int, data: GoalUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal: raise HTTPException(404, "Goal not found")
    if goal.is_locked and current_user.role == "employee":
        raise HTTPException(403, "Goal is locked after approval")
    for k, v in data.dict(exclude_none=True).items():
        setattr(goal, k, v)
    log_action(db, current_user.id, "Goal Updated", f"Goal #{goal_id}")
    db.commit(); db.refresh(goal)
    return goal

@router.delete("/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_role("employee"))):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal: raise HTTPException(404, "Not found")
    if goal.is_locked: raise HTTPException(403, "Cannot delete locked goal")
    db.delete(goal); db.commit()
    return {"message": "Deleted"}

@router.post("/{employee_id}/submit")
def submit_goals(employee_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_role("employee"))):
    goals = db.query(Goal).filter(Goal.employee_id == employee_id, Goal.status == "draft").all()
    total_w = sum(g.weightage for g in goals)
    if total_w != 100:
        raise HTTPException(400, f"Total weightage must be 100% (currently {total_w}%)")
    for g in goals: g.status = "pending"
    log_action(db, current_user.id, "Goal Sheet Submitted", "Goal Sheet", "Draft", "Pending Approval")
    db.commit()
    return {"message": "Submitted"}

@router.post("/{employee_id}/approve")
def approve_goals(employee_id: int, comment: str, db: Session = Depends(get_db), current_user: User = Depends(require_role("manager"))):
    goals = db.query(Goal).filter(Goal.employee_id == employee_id, Goal.status == "pending").all()
    for g in goals: g.status = "approved"; g.is_locked = True
    log_action(db, current_user.id, "Goal Sheet Approved", "Goal Sheet", "Pending", f"Approved: {comment}")
    db.commit()
    return {"message": "Approved"}

@router.post("/{employee_id}/reject")
def reject_goals(employee_id: int, comment: str, db: Session = Depends(get_db), current_user: User = Depends(require_role("manager"))):
    goals = db.query(Goal).filter(Goal.employee_id == employee_id, Goal.status == "pending").all()
    for g in goals: g.status = "draft"
    log_action(db, current_user.id, "Goal Sheet Rejected", "Goal Sheet", "Pending", f"Rejected: {comment}")
    db.commit()
    return {"message": "Returned for rework"}
