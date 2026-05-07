from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import AuditLog

router = APIRouter()

@router.get("/logs")
def get_audit_logs(db: Session = Depends(get_db)):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()
