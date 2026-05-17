from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import AuditLog
from app.auth.utils import require_role

router = APIRouter()

@router.get("")
def get_audit_logs(db: Session = Depends(get_db), current_user=Depends(require_role("admin", "manager"))):
    return db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(200).all()
