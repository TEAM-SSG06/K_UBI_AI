import random
import uuid
import json
from datetime import datetime, timedelta
from app.core.database import SessionLocal, engine, Base
from app.models.entities import SourceRecord, Event, UBID, ReviewQueue
from engines.security import hash_pii, phonetic_encode
import pandas as pd
import os

KAGGLE_PATH = r"C:\Users\arund\.cache\kagglehub\datasets\rowhitswami\all-indian-companies-registration-data-1900-2019\versions\2\registered_companies.csv"

# We need to recreate tables first since we changed schema
Base.metadata.create_all(bind=engine)

def random_date(start_days_ago=1000, end_days_ago=0):
    now = datetime.utcnow()
    # Ensure start is older than end
    if start_days_ago < end_days_ago:
        start_days_ago, end_days_ago = end_days_ago, start_days_ago
    return now - timedelta(days=random.randint(end_days_ago, start_days_ago))

def random_pan():
    return f"ABCDE{random.randint(1000, 9999)}F"

def random_gstin(pan):
    return f"29{pan}1Z5"

# Complex Edge Cases Scenarios
def generate_parent_subsidiary(db, base_pan):
    """Same PAN, Different GSTIN, Same Address"""
    address = {"street": "Tech Park Main Road", "city": "Bengaluru", "district": "Bangalore Urban", "pincode": "560100"}
    
    # Parent - Commercial Taxes
    r1 = SourceRecord(
        department="Commercial Taxes",
        source_id=f"CT-{uuid.uuid4().hex[:6]}",
        raw_data={
            "legal_name": "Apex Holdings Ltd",
            "trade_name": "Apex Group",
            "gstin": random_gstin(base_pan),
            "pan": base_pan,
            "principal_place_of_business": address
        },
        extracted_name="Apex Holdings Ltd",
        extracted_address="Tech Park Main Road Bengaluru",
        extracted_pincode="560100",
        phonetic_name=phonetic_encode("Apex Holdings Ltd"),
        hashed_pan=hash_pii(base_pan),
        hashed_gstin=hash_pii(random_gstin(base_pan))
    )
    db.add(r1)
    
    # Subsidiary - Factories
    r2 = SourceRecord(
        department="Factories",
        source_id=f"FAC-{uuid.uuid4().hex[:6]}",
        raw_data={
            "factory_name": "Apex Manufacturing Sub",
            "occupier_name": "John Doe",
            "location": address,
            "license_no": "LIC999"
        },
        extracted_name="Apex Manufacturing Sub",
        extracted_address="Tech Park Main Road Bengaluru",
        extracted_pincode="560100",
        phonetic_name=phonetic_encode("Apex Manufacturing Sub"),
        hashed_pan=hash_pii(base_pan) # Inherited PAN theoretically, though missing from raw
    )
    db.add(r2)
    return [r1, r2]

def generate_franchise(db, name):
    """Same Name, Different Owners, Different PANs, Different Locations"""
    records = []
    for i in range(2):
        pan = random_pan()
        r = SourceRecord(
            department="Labour",
            source_id=f"LAB-{uuid.uuid4().hex[:6]}",
            raw_data={
                "establishment_name": name,
                "owner_name": f"Owner {i}",
                "full_address": f"Location {i} Street",
                "pincode": f"56000{i}"
            },
            extracted_name=name,
            extracted_address=f"Location {i} Street",
            extracted_pincode=f"56000{i}",
            phonetic_name=phonetic_encode(name),
            hashed_pan=hash_pii(pan)
        )
        db.add(r)
        records.append(r)
    return records

def generate_mock_data():
    db = SessionLocal()
    
    # 1. Database Flush
    if db.query(SourceRecord).count() > 0:
        db.execute(ReviewQueue.__table__.delete())
        db.execute(Event.__table__.delete())
        db.execute(SourceRecord.__table__.delete())
        db.execute(UBID.__table__.delete())
        db.commit()

    if not os.path.exists(KAGGLE_PATH):
        return {"status": "error", "message": "Kaggle dataset not found. Please run the download script."}

    # 2. Load Karnataka Sample
    # We load 2000 records as base "Truth" to generate variations from
    try:
        df_full = pd.read_csv(KAGGLE_PATH, low_memory=False)
        df_kar = df_full[df_full['REGISTERED_STATE'] == 'Karnataka'].sample(n=1000, random_state=42)
    except Exception as e:
        return {"status": "error", "message": f"Failed to read dataset: {str(e)}"}

    all_records = []
    
    # Status Mapping (ROC -> K-UBI)
    STATUS_MAP = {
        "ACTV": "ACTIVE", "DRMT": "DORMANT", "D455": "DORMANT",
        "STOF": "CLOSED", "DISD": "CLOSED", "LIQD": "CLOSED",
        "AMAL": "CLOSED", "ULQD": "DORMANT"
    }

    # 3. Process ROC Records into Medallion Bronze Layer
    # Replace NaNs with None to avoid JSON serialization errors (NaN is not valid JSON)
    df_kar = df_kar.where(pd.notnull(df_kar), None)
    
    for _, row in df_kar.iterrows():
        base_name = str(row['COMPANY_NAME'])
        cin = str(row['CORPORATE_IDENTIFICATION_NUMBER'])
        address = str(row['REGISTERED_OFFICE_ADDRESS'])
        
        # Inject realistic noise for entity resolution demo
        # For each record, we'll create 1.2 records on average (some duplicates with noise)
        variants = [base_name]
        if random.random() > 0.7:
            # Create a typo or fragment variant
            if len(base_name) > 10:
                variant = base_name[:random.randint(8, len(base_name)-2)] + " LTD"
                variants.append(variant)

        for name_variant in variants:
            # Randomly drop some fields to simulate siloed data
            has_pan = random.random() > 0.4
            pan = f"ABCDE{random.randint(1000, 9999)}F" if has_pan else None
            
            # Map ROC schema to our Bronze schema
            r = SourceRecord(
                department=random.choice(["Commercial Taxes", "Labour", "Factories", "BESCOM", "KSPCB"]),
                source_id=f"ROC-{cin[:6]}",
                raw_data=row.to_dict(), # Store full ROC JSONB
                extracted_name=name_variant,
                extracted_address=address[:100],
                extracted_pincode=address[-6:] if address[-6:].isdigit() else "560001",
                phonetic_name=phonetic_encode(name_variant),
                hashed_pan=hash_pii(pan) if pan else None
            )
            db.add(r)
            all_records.append(r)
            
            # 4. Generate Events based on ROC status
            roc_status = str(row['COMPANY_STATUS'])
            mapped_status = STATUS_MAP.get(roc_status, "ACTIVE")
            
            if mapped_status == "ACTIVE":
                # High-frequency activity signals
                num_events = random.randint(5, 15)
                for _ in range(num_events):
                    e_type = random.choice(["Annual Filing", "GST Return", "Labour Compliance", "Tax Payment"])
                    db.add(Event(
                        source_record_id=r.id,
                        event_type=e_type,
                        event_date=random_date(120), # Very recent
                        life_points=random.randint(40, 100) # High impact
                    ))
            elif mapped_status == "DORMANT":
                # Low-frequency, older signals
                num_events = random.randint(2, 4)
                for _ in range(num_events):
                    db.add(Event(
                        source_record_id=r.id,
                        event_type="Utility Payment",
                        event_date=random_date(500, 200),
                        life_points=random.randint(5, 15) # Low impact
                    ))
            else: # CLOSED
                # Residual old signals only
                if random.random() > 0.8:
                    db.add(Event(
                        source_record_id=r.id,
                        event_type="Old Inspection",
                        event_date=random_date(1500, 1000),
                        life_points=50
                    ))

    db.commit()
    db.close()
    return {"status": "success", "records_created": len(all_records), "source": "Kaggle ROC Dataset", "events_created": "Massive"}

if __name__ == "__main__":
    generate_mock_data()
    print("Substantive mock data generated.")
