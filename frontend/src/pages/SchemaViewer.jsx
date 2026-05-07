import React, { useEffect } from 'react';
import mermaid from 'mermaid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SchemaViewer() {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true, theme: 'dark' });
    mermaid.contentLoaded();
  }, []);

  const schemaDefinition = `
    erDiagram
        UBID ||--o{ SourceRecord : "has many"
        SourceRecord ||--o{ Event : "has many"
        SourceRecord ||--o{ ReviewQueue : "part of"
        UBID {
            uuid id PK
            varchar canonical_name
            enum status "ACTIVE, DORMANT, CLOSED"
            int activity_pulse_score
            jsonb evidence_trail
            varchar anchored_pan
            varchar anchored_gstin
            timestamp created_at
        }
        SourceRecord {
            uuid id PK
            uuid ubid_id FK
            varchar department
            varchar source_id
            jsonb raw_data "Bronze Layer"
            varchar extracted_name
            varchar extracted_address
            varchar phonetic_name "Double Metaphone"
            varchar hashed_pan "SHA-256"
        }
        Event {
            uuid id PK
            uuid source_record_id FK
            varchar event_type
            timestamp event_date
            int life_points
        }
        ReviewQueue {
            uuid id PK
            uuid record_1_id FK
            uuid record_2_id FK
            float confidence_score
            enum status
        }
        AuditLog {
            uuid id PK
            varchar action
            varchar user_id
            varchar justification
            timestamp timestamp
        }
  `;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Database Schema Map</h1>
        <p className="text-muted-foreground">Interactive entity-relationship diagram for the K-UBI platform.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medallion Architecture Models</CardTitle>
          <CardDescription>Visualizing the Bronze (JSONB), Silver (Hashed), and Gold (UBID) layers.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center bg-slate-900/50 p-8 rounded-lg overflow-auto">
          <div className="mermaid">
            {schemaDefinition}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
