from pydantic import BaseModel, UUID4, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.entities import UBIDStatus, ReviewStatus

class EventBase(BaseModel):
    event_type: str
    event_date: datetime
    description: Optional[str] = None
    life_points: int = 0

class EventResponse(EventBase):
    id: UUID4
    source_record_id: UUID4

    model_config = ConfigDict(from_attributes=True)

class SourceRecordBase(BaseModel):
    department: str
    source_id: str
    raw_data: Dict[str, Any]
    extracted_name: str
    extracted_address: str
    extracted_pincode: str
    phonetic_name: str
    hashed_pan: Optional[str] = None
    hashed_gstin: Optional[str] = None

class SourceRecordResponse(SourceRecordBase):
    id: UUID4
    ubid_id: Optional[UUID4] = None
    created_at: datetime
    events: List[EventResponse] = []

    model_config = ConfigDict(from_attributes=True)

class UBIDBase(BaseModel):
    canonical_name: str
    anchored_pan: Optional[str] = None
    anchored_gstin: Optional[str] = None
    activity_pulse_score: int = 0
    evidence_trail: Dict[str, Any] = {}

class UBIDResponse(UBIDBase):
    id: UUID4
    status: UBIDStatus
    created_at: datetime
    updated_at: datetime
    source_records: List[SourceRecordResponse] = []

    model_config = ConfigDict(from_attributes=True)

class ReviewQueueResponse(BaseModel):
    id: UUID4
    record_1: SourceRecordResponse
    record_2: SourceRecordResponse
    confidence_score: float
    status: ReviewStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
