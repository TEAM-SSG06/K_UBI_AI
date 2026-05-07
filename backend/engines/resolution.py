import pandas as pd
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.entities import SourceRecord, UBID, ReviewQueue, ReviewStatus
import uuid
import os

# Splink imports
from splink import DuckDBAPI, Linker
import splink.comparison_library as cl

def perform_entity_resolution():
    db: Session = SessionLocal()
    
    # 1. Fetch unlinked records
    records = db.query(SourceRecord).filter(SourceRecord.ubid_id == None).all()
    if not records:
        db.close()
        return {"status": "no_records_to_process"}

    # Convert to pandas DataFrame for Splink
    data = []
    for r in records:
        data.append({
            "unique_id": str(r.id), # Splink requires unique_id
            "name": r.extracted_name or "",
            "address": r.extracted_address or "",
            "pincode": r.extracted_pincode or "",
            "hashed_pan": r.hashed_pan,
            "phonetic_name": r.phonetic_name or "",
            "department": r.department
        })
    df = pd.DataFrame(data)

    if len(df) <= 1:
        # Just assign UBIDs
        for r in records:
            if not r.ubid_id:
                new_ubid = UBID(canonical_name=r.extracted_name)
                db.add(new_ubid)
                db.commit()
                r.ubid_id = new_ubid.id
        db.commit()
        db.close()
        return {"status": "success_single", "processed": len(records)}

    # 2. Splink Settings (Probabilistic Linkage)
    settings = {
        "link_type": "dedupe_only",
        "probability_two_random_records_match": 0.05,
        "blocking_rules_to_generate_predictions": [
            "l.pincode = r.pincode",
            "l.phonetic_name = r.phonetic_name",
            "l.hashed_pan = r.hashed_pan and l.hashed_pan is not null"
        ],
        "comparisons": [
            cl.NameComparison("name").configure(
                m_probabilities=[0.9, 0.05, 0.02, 0.01, 0.02],
                u_probabilities=[0.0001, 0.001, 0.01, 0.1, 0.8889]
            ),
            cl.NameComparison("phonetic_name").configure(
                m_probabilities=[0.9, 0.05, 0.02, 0.01, 0.02],
                u_probabilities=[0.0001, 0.001, 0.01, 0.1, 0.8889]
            ),
            cl.LevenshteinAtThresholds("address", 2).configure(
                m_probabilities=[0.7, 0.2, 0.1],
                u_probabilities=[0.001, 0.01, 0.989]
            ),
            cl.ExactMatch("hashed_pan").configure(
                m_probabilities=[0.95, 0.05],
                u_probabilities=[0.00001, 0.99999]
            ),
            cl.ExactMatch("pincode").configure(
                m_probabilities=[0.9, 0.1],
                u_probabilities=[0.01, 0.99]
            )
        ],
        "retain_matching_columns": True,
        "retain_intermediate_calculation_columns": True
    }

    # 3. Initialize Linker
    db_api = DuckDBAPI()
    linker = Linker(df, settings, db_api=db_api)

    # 4. Predict
    # Using threshold_match_probability=0.2 to capture silver tier matches (0.60)
    df_predict = linker.inference.predict(threshold_match_probability=0.2)
    predictions = df_predict.as_pandas_dataframe()

    # 5. Process Predictions into Gold/Silver/Bronze Tiers
    processed_ids = set()

    # Sort by probability descending to process highest confidence first
    predictions = predictions.sort_values(by='match_probability', ascending=False)

    for _, row in predictions.iterrows():
        id1 = row['unique_id_l']
        id2 = row['unique_id_r']
        prob = row['match_probability']
        
        if id1 in processed_ids or id2 in processed_ids:
            continue
            
        if prob >= 0.95: # GOLD TIER
            r1 = db.query(SourceRecord).get(uuid.UUID(id1))
            r2 = db.query(SourceRecord).get(uuid.UUID(id2))
            
            target_ubid = r1.ubid_id or r2.ubid_id
            if not target_ubid:
                new_ubid = UBID(canonical_name=r1.extracted_name)
                db.add(new_ubid)
                db.flush()
                target_ubid = new_ubid.id
                
            r1.ubid_id = target_ubid
            r2.ubid_id = target_ubid
            processed_ids.add(id1)
            processed_ids.add(id2)
            
        elif prob >= 0.60: # SILVER TIER (Human Review)
            # Send to Review Queue
            review_item = ReviewQueue(
                record_1_id=uuid.UUID(id1),
                record_2_id=uuid.UUID(id2),
                confidence_score=prob,
                status=ReviewStatus.PENDING
            )
            db.add(review_item)
            # Mark as processed so they don't get auto-assigned a UBID yet
            processed_ids.add(id1)
            processed_ids.add(id2)
            
        # BRONZE TIER (<0.60) is ignored (stay separate)

    db.commit()
    
    # Assign new UBIDs to records that stayed separate (Bronze Tier or un-paired)
    for r in records:
        if str(r.id) not in processed_ids and not r.ubid_id:
            new_ubid = UBID(canonical_name=r.extracted_name)
            db.add(new_ubid)
            db.commit()
            r.ubid_id = new_ubid.id

    db.commit()
    db.close()
    return {"status": "success", "pairs_predicted": len(predictions)}

if __name__ == "__main__":
    res = perform_entity_resolution()
    print("Splink Resolution complete:", res)
