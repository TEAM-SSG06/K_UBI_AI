import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const API_URL = 'http://127.0.0.1:8000/api';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/audit/logs`);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filteredLogs = logs.filter(log => 
    log.justification?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.decision?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.reviewer_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">Traceability for every manual intervention in the K-UBI pipeline.</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search logs..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Decision</TableHead>
                <TableHead>Justification</TableHead>
                <TableHead className="text-right">Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm">{log.reviewer_id}</TableCell>
                  <TableCell>
                    <Badge variant={log.decision === 'APPROVE_MERGE' ? 'success' : 'destructive'}>
                      {log.decision}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md truncate text-sm" title={log.justification}>
                    {log.justification}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground font-mono">
                    {log.review_queue_id.substring(0, 8)}...
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No audit records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
