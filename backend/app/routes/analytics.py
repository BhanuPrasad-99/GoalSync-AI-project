from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Goal, Achievement, User, AuditLog
from app.auth.utils import get_current_user, require_role

router = APIRouter()

@router.get("/employee")
def employee_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goals = db.query(Goal).filter(Goal.employee_id == current_user.id, Goal.status == "approved").all()
    goal_ids = [g.id for g in goals]
    achs = db.query(Achievement).filter(Achievement.goal_id.in_(goal_ids)).all()
    avg = round(sum(a.progress for a in achs) / len(achs), 1) if achs else 0
    return {"total_goals": len(goals), "avg_progress": avg, "completed": sum(1 for a in achs if a.status == "Completed"), "on_track": sum(1 for a in achs if a.status == "On Track")}

@router.get("/manager")
def manager_analytics(db: Session = Depends(get_db), current_user: User = Depends(require_role("manager"))):
    team = db.query(User).filter(User.manager_id == current_user.id).all()
    pending = db.query(Goal).filter(Goal.employee_id.in_([u.id for u in team]), Goal.status == "pending").count()
    return {"team_size": len(team), "pending_approvals": pending}

@router.get("/admin")
def admin_analytics(db: Session = Depends(get_db), current_user: User = Depends(require_role("admin"))):
    total_goals = db.query(Goal).count()
    approved = db.query(Goal).filter(Goal.status == "approved").count()
    pending  = db.query(Goal).filter(Goal.status == "pending").count()
    return {"total_goals": total_goals, "approved": approved, "pending": pending}
