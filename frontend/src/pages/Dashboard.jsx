import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, Zap, GitMerge, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const API_URL = 'http://kubiai-production.up.railway.app/api';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMetrics = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard/metrics`);
      setMetrics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleAction = async (endpoint) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/dashboard/${endpoint}`);
      await fetchMetrics();
    } catch (err) {
      console.error(err);
      alert('Action failed');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground mt-2">Telemetry and controls for the K-UBI shadow truth layer.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => handleAction('generate-mock-data')}>
            <Database className="w-4 h-4 mr-2" /> Inject Bronze Data
          </Button>
          <Button variant="outline" onClick={() => handleAction('run-resolution')}>
            <GitMerge className="w-4 h-4 mr-2" /> Run Splink Engine
          </Button>
          <Button onClick={() => handleAction('run-activity-classification')}>
            <Zap className="w-4 h-4 mr-2" /> Update Activity Pulse
          </Button>
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total UBIDs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{metrics.total_ubids}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-500 uppercase tracking-wider">Active Entities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{metrics.active_ubids}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-500 uppercase tracking-wider">Dormant Entities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{metrics.dormant_ubids}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-500 uppercase tracking-wider">Closed Entities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{metrics.closed_ubids}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Raw Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{metrics.total_source_records}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500"/> What is Activity Pulse?</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>The <strong>Activity Pulse</strong> is a temporal intelligence engine. Instead of a static "Active" flag, it calculates a dynamic score based on the frequency and reliability of department events (e.g., GST filings, BESCOM utility payments, Labour inspections).</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>High LP (90-100):</strong> Reliable statutory filings (Tax, Labour).</li>
              <li><strong>Medium LP (50-70):</strong> Utility payments (Electricity, Water).</li>
              <li><strong>Temporal Decay:</strong> Events older than 6 months lose 50% of their Life Points. Events older than 24 months are worth 0.</li>
            </ul>
            <p>The "Update Activity Pulse" button aggregates all these signals across the resolved UBID clusters to determine if they are <strong>ACTIVE</strong> (&ge; 100 LP), <strong>DORMANT</strong> (&ge; 50 LP), or <strong>CLOSED</strong>.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Download className="w-5 h-5"/> Data Export</CardTitle>
            <p className="text-sm text-muted-foreground">Download the entire canonical registry as a CSV file for reporting.</p>
          </CardHeader>
          <CardContent>
            <a href={`${API_URL}/export/csv`} download>
              <Button variant="secondary" className="w-full">
                Download Master CSV
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
