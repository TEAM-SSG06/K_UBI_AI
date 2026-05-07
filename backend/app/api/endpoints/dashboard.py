from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import UBID, UBIDStatus, SourceRecord
from engines.data_generator import generate_mock_data
from engines.resolution import perform_entity_resolution
from engines.activity import update_activity_statuses

router = APIRouter()

@router.post("/generate-mock-data")
def trigger_mock_data_generation(db: Session = Depends(get_db)):
    res = generate_mock_data()
    return res

@router.post("/run-resolution")
def trigger_resolution(db: Session = Depends(get_db)):
    res = perform_entity_resolution()
    return res

@router.post("/run-activity-classification")
def trigger_activity(db: Session = Depends(get_db)):
    res = update_activity_statuses()
    return res

@router.get("/metrics")
def get_metrics(db: Session = Depends(get_db)):
    total_ubids = db.query(UBID).count()
    active = db.query(UBID).filter(UBID.status == UBIDStatus.ACTIVE).count()
    dormant = db.query(UBID).filter(UBID.status == UBIDStatus.DORMANT).count()
    closed = db.query(UBID).filter(UBID.status == UBIDStatus.CLOSED).count()
    
    total_records = db.query(SourceRecord).count()
    
    return {
        "total_ubids": total_ubids,
        "active_ubids": active,
        "dormant_ubids": dormant,
        "closed_ubids": closed,
        "total_source_records": total_records
    }
