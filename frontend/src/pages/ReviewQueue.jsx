import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, ShieldAlert, CheckCircle2, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

import { API_URL } from '@/config';

export default function ReviewQueue() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [justification, setJustification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/review/queue`);
      setQueue(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleDecision = async (id, decision) => {
    if (!justification.trim()) {
      alert("Please provide a justification for this decision.");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/review/queue/${id}`, { 
        decision,
        justification: justification
      });
      setJustification('');
      fetchQueue();
    } catch (err) {
      console.error(err);
      alert('Failed to submit decision');
    }
    setIsSubmitting(false);
  };

  if (loading) return <div className="p-8">Loading audit queue...</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HITL Review Queue</h1>
        <p className="text-muted-foreground">Human-in-the-Loop verification for Silver Tier matches (60% - 94% confidence).</p>
      </div>

      {queue.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-24 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Audit Queue Clear</h3>
          <p className="text-muted-foreground">All ambiguous records have been successfully classified.</p>
        </Card>
      ) : (
        queue.map(item => (
          <Card key={item.id} className="overflow-hidden border-yellow-500/50">
            <CardHeader className="bg-yellow-500/10 border-b pb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500 font-bold">
                  <ShieldAlert size={20} />
                  Splink Silver Tier Match
                </div>
                <Badge variant="warning" className="text-base">
                  Confidence: {(item.confidence_score * 100).toFixed(1)}%
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-start">
                
                {/* Record 1 */}
                <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-900">
                  <Badge className="mb-4">{item.record_1.department}</Badge>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase">Extracted Name</div>
                      <div className="text-lg font-medium">{item.record_1.extracted_name}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase">Address & Pincode</div>
                      <div>{item.record_1.extracted_address}, {item.record_1.extracted_pincode}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase">Phonetic Key (Double Metaphone)</div>
                      <div className="font-mono text-xs">{item.record_1.phonetic_name}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase">Vaulted Identifiers (HMAC)</div>
                      <div className="font-mono text-xs truncate" title={item.record_1.hashed_pan}>
                        PAN: {item.record_1.hashed_pan ? item.record_1.hashed_pan.substring(0,16)+'...' : 'NULL'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* VS Divider */}
                <div className="flex flex-col items-center justify-center pt-8 md:pt-16 text-muted-foreground font-black text-2xl">
                  VS
                </div>

                {/* Record 2 */}
                <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-900">
                  <Badge className="mb-4">{item.record_2.department}</Badge>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase">Extracted Name</div>
                      <div className="text-lg font-medium">{item.record_2.extracted_name}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase">Address & Pincode</div>
                      <div>{item.record_2.extracted_address}, {item.record_2.extracted_pincode}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase">Phonetic Key (Double Metaphone)</div>
                      <div className="font-mono text-xs">{item.record_2.phonetic_name}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase">Vaulted Identifiers (HMAC)</div>
                      <div className="font-mono text-xs truncate" title={item.record_2.hashed_pan}>
                        PAN: {item.record_2.hashed_pan ? item.record_2.hashed_pan.substring(0,16)+'...' : 'NULL'}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Splink AI Waterfall Evidence */}
              <div className="mt-8 p-6 bg-slate-900 text-white rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldAlert className="text-primary" />
                  <h3 className="text-lg font-bold">Splink AI Evidence (Waterfall)</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                  The Fellegi-Sunter model assigned a final probability of <strong>{(item.confidence_score * 100).toFixed(1)}%</strong>. 
                  Below are the strongest weights driving this decision:
                </p>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between items-center p-2 rounded bg-slate-800">
                    <span>Block: Pincode ({item.record_1.extracted_pincode})</span>
                    <span className="text-blue-400">Search Space Reduced</span>
                  </div>
                  {item.record_1.phonetic_name === item.record_2.phonetic_name ? (
                     <div className="flex justify-between items-center p-2 rounded bg-slate-800">
                      <span>Exact Match: Phonetic Name (Double Metaphone)</span>
                      <span className="text-green-400">+ Strong Evidence (m &gt; u)</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center p-2 rounded bg-slate-800">
                      <span>Mismatch: Phonetic Name</span>
                      <span className="text-red-400">- Penalty Applied</span>
                    </div>
                  )}
                  {item.record_1.hashed_pan && item.record_1.hashed_pan === item.record_2.hashed_pan ? (
                     <div className="flex justify-between items-center p-2 rounded bg-slate-800 border border-green-500/30">
                      <span>Exact Match: Vaulted PAN</span>
                      <span className="text-green-400">+ Definitive Link (m &gt;&gt; u)</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center p-2 rounded bg-slate-800">
                      <span>Missing/Mismatch: Vaulted PAN</span>
                      <span className="text-slate-500">Neutral / No Penalty</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Justification Box */}
              <div className="mt-8">
                <label className="text-sm font-semibold mb-2 block">Audit Justification</label>
                <textarea 
                  className="w-full p-3 rounded-lg border bg-background h-24 resize-none focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Explain why you are merging or rejecting this pair (Mandatory for Audit Logs)..."
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="bg-muted/50 p-6 flex justify-end gap-4 border-t">
              <div className="flex gap-4 mt-6">
                <Button 
                  className="flex-1 h-12 text-lg font-bold bg-green-600 hover:bg-green-700"
                  onClick={() => handleDecision(item.id, 'APPROVE_MERGE')}
                  disabled={isSubmitting}
                >
                  Approve & Merge
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1 h-12 text-lg font-bold"
                  onClick={() => handleDecision(item.id, 'REJECT')}
                  disabled={isSubmitting}
                >
                  Reject Match
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
