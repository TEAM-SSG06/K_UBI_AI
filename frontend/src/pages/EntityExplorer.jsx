import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Building, Clock, MapPin, FileText, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const API_URL = 'http://127.0.0.1:8000/api';

export default function EntityExplorer() {
  const [ubids, setUbids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUbid, setSelectedUbid] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUbids();
  }, []);

  const fetchUbids = async () => {
    try {
      const res = await axios.get(`${API_URL}/search/list/`);
      setUbids(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const loadUbidDetails = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/search/${id}`);
      setSelectedUbid(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUbids = ubids.filter(u => 
    u.canonical_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.id.includes(searchTerm)
  );

  if (loading) return <div className="p-8">Loading master registry...</div>;

  return (
    <div className="flex gap-8 h-full">
      {/* Sidebar List */}
      <div className="w-80 flex flex-col border-r pr-6 h-full">
        <div className="pb-6 border-b">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Master Registry</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search UBID or Name..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pt-4 space-y-2">
          {filteredUbids.map(ubid => (
            <div 
              key={ubid.id}
              onClick={() => loadUbidDetails(ubid.id)}
              className={`p-4 rounded-xl cursor-pointer border transition-colors ${
                selectedUbid?.ubid.id === ubid.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-transparent hover:bg-muted'
              }`}
            >
              <div className="font-semibold truncate">{ubid.canonical_name}</div>
              <div className="text-xs text-muted-foreground font-mono mt-1">ID: {ubid.id.substring(0,8)}...</div>
              <div className="mt-2 flex justify-between items-center">
                <Badge variant={ubid.status === 'ACTIVE' ? 'success' : ubid.status === 'DORMANT' ? 'warning' : 'destructive'}>
                  {ubid.status}
                </Badge>
                <span className="text-xs font-bold text-primary">{ubid.activity_pulse_score} LP</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Panel */}
      <div className="flex-1 overflow-y-auto pr-2 pb-12">
        {selectedUbid ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{selectedUbid.ubid.canonical_name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground font-mono">
                      <Building className="w-4 h-4" /> UBID: {selectedUbid.ubid.id}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={selectedUbid.ubid.status === 'ACTIVE' ? 'success' : selectedUbid.ubid.status === 'DORMANT' ? 'warning' : 'destructive'} className="text-lg px-4 py-1">
                      {selectedUbid.ubid.status}
                    </Badge>
                    <div className="mt-2 font-bold text-primary flex items-center justify-end gap-1">
                      <Activity className="w-4 h-4" /> {selectedUbid.ubid.activity_pulse_score} Life Points
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Linked Records */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="text-primary" /> Constituents (Bronze Records)
                </h3>
                {selectedUbid.source_records.map(record => (
                  <Card key={record.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-2">
                        <Badge variant="outline" className="text-primary">{record.department}</Badge>
                        <span className="text-xs text-muted-foreground font-mono">{record.source_id}</span>
                      </div>
                      <div className="font-semibold mb-1">{record.extracted_name}</div>
                      <div className="text-sm text-muted-foreground flex items-start gap-1">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                        {record.extracted_address}, {record.extracted_pincode}
                      </div>
                      <div className="mt-3 pt-3 border-t text-xs text-muted-foreground font-mono break-all">
                        <strong>Raw Data:</strong> {JSON.stringify(record.raw_data)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Activity Timeline */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Clock className="text-primary" /> Temporal Pulse Timeline
                </h3>
                
                {selectedUbid.ubid.evidence_trail?.verdict_justification && (
                  <Card className="bg-muted">
                    <CardContent className="p-4 text-sm font-medium">
                      Verdict: {selectedUbid.ubid.evidence_trail.verdict_justification}
                    </CardContent>
                  </Card>
                )}

                <div className="relative border-l-2 border-primary/30 ml-4 space-y-6 pt-2">
                  {selectedUbid.events.map((event) => (
                    <div key={event.id} className="relative pl-6">
                      <div className="absolute w-4 h-4 bg-background border-2 border-primary rounded-full -left-[9px] top-1"></div>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-sm text-muted-foreground">
                              {new Date(event.event_date).toLocaleDateString()}
                            </div>
                            <Badge variant="secondary" className="font-mono text-xs">+{event.life_points} LP Base</Badge>
                          </div>
                          <div className="font-bold text-lg">{event.event_type}</div>
                          {event.description && <div className="text-sm text-muted-foreground mt-1">{event.description}</div>}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                  {selectedUbid.events.length === 0 && (
                    <div className="pl-6 text-muted-foreground italic">No historical events recorded.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-50">
            <Search className="w-24 h-24 mb-6" />
            <h3 className="text-2xl font-bold mb-2">Select an Entity</h3>
            <p className="max-w-md">Choose a UBID from the registry to view its un-vaulted profile, constituent records, and temporal pulse history.</p>
          </div>
        )}
      </div>
    </div>
  );
}
