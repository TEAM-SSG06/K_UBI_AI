import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, GitMerge, FileJson } from 'lucide-react';

import { API_URL } from '@/config';

export default function MergeVisualizer() {
  const [ubids, setUbids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/search/list/`);
        // Filter out UBIDs that only have 1 source record for better visualization
        const mergedUbids = [];
        for (const u of res.data) {
           const details = await axios.get(`${API_URL}/search/${u.id}`);
           if (details.data.source_records.length > 1) {
             mergedUbids.push(details.data);
           }
        }
        setUbids(mergedUbids);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading merge topologies...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Merge Visualizer</h1>
        <p className="text-muted-foreground">Trace data lineage from fragmented Bronze records to Gold UBID clusters.</p>
      </div>

      {ubids.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            No merged entities found. Run the Splink engine first.
          </CardContent>
        </Card>
      ) : (
        ubids.map(data => (
          <Card key={data.ubid.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Pre-Merge Side (Bronze) */}
              <div className="flex-1 p-6 bg-slate-900/20 border-r">
                <div className="flex items-center gap-2 mb-6">
                  <FileJson className="text-muted-foreground" />
                  <h3 className="font-semibold text-lg">Pre-Merge (Bronze)</h3>
                </div>
                <div className="space-y-4">
                  {data.source_records.map(record => (
                    <div key={record.id} className="p-4 rounded-lg border bg-card text-sm">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="outline">{record.department}</Badge>
                        <span className="text-xs text-muted-foreground font-mono">{record.source_id}</span>
                      </div>
                      <div className="font-medium mb-1">{record.extracted_name}</div>
                      <div className="text-muted-foreground text-xs truncate">{record.extracted_address}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Merge Node */}
              <div className="hidden md:flex items-center justify-center -mx-4 z-10">
                <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
                  <GitMerge className="w-6 h-6" />
                </div>
              </div>

              {/* Post-Merge Side (Gold) */}
              <div className="flex-1 p-6 bg-primary/5">
                <div className="flex items-center gap-2 mb-6">
                  <Badge className="bg-yellow-500 text-black">Gold Tier</Badge>
                  <h3 className="font-semibold text-lg">Post-Merge (UBID)</h3>
                </div>
                
                <Card className="border-primary/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl">{data.ubid.canonical_name}</CardTitle>
                    <p className="text-sm font-mono text-muted-foreground">ID: {data.ubid.id}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="success">{data.ubid.status}</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">Activity Pulse</span>
                      <span className="font-bold text-primary">{data.ubid.activity_pulse_score} LP</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Constituent Records</span>
                      <Badge variant="secondary">{data.source_records.length} sources</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
