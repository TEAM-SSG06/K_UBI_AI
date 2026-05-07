from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import UBID, SourceRecord, Event
from pydantic import UUID4

router = APIRouter()

@router.get("/{ubid_id}")
def get_ubid_details(ubid_id: UUID4, db: Session = Depends(get_db)):
    ubid = db.query(UBID).get(ubid_id)
    if not ubid:
        raise HTTPException(status_code=404, detail="UBID not found")
        
    records = db.query(SourceRecord).filter(SourceRecord.ubid_id == ubid.id).all()
    record_ids = [r.id for r in records]
    events = db.query(Event).filter(Event.source_record_id.in_(record_ids)).order_by(Event.event_date.desc()).all()
    
    return {
        "ubid": ubid,
        "source_records": records,
        "events": events
    }

@router.get("/lookup/source/{source_id}")
def lookup_by_source_id(source_id: str, db: Session = Depends(get_db)):
    record = db.query(SourceRecord).filter(SourceRecord.source_id == source_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Source record not found")
        
    if record.ubid_id:
        return {"ubid_id": record.ubid_id, "status": "resolved"}
    else:
        return {"status": "unresolved", "record_id": record.id}

@router.get("/list/")
def list_ubids(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    ubids = db.query(UBID).offset(skip).limit(limit).all()
    return ubids
