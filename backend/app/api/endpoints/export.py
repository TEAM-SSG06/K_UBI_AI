from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import UBID
import csv
import io

router = APIRouter()

@router.get("/csv")
def export_ubids_csv(status: str = None, db: Session = Depends(get_db)):
    query = db.query(UBID)
    if status:
        query = query.filter(UBID.status == status.upper())
        
    ubids = query.all()
    
    # We use a generator to stream the response for large datasets
    def iter_csv(data):
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write Header
        writer.writerow(["UBID", "Canonical Name", "Status", "Activity Pulse Score", "Anchored PAN", "Anchored GSTIN", "Created At", "Verdict Justification"])
        yield output.getvalue()
        output.seek(0)
        output.truncate(0)
        
        for u in data:
            justification = u.evidence_trail.get("verdict_justification", "") if u.evidence_trail else ""
            writer.writerow([str(u.id), u.canonical_name, u.status.value, u.activity_pulse_score, u.anchored_pan, u.anchored_gstin, u.created_at.isoformat(), justification])
            yield output.getvalue()
            output.seek(0)
            output.truncate(0)

    response = StreamingResponse(iter_csv(ubids), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=ubid_export.csv"
    return response
