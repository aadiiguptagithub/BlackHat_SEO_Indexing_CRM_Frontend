import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CreateJobModal from './CreateJobModal';
import { useToast } from '@/components/ui/use-toast';

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await jobsAPI.getJobs();
      if (response.success) {
        setJobs(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (id, name) => {
    try {
      const res = await jobsAPI.exportJob(id);
      if (res.success) {
        const blob = res.data;
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name || 'job'}-${id}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast({ title: 'Export started', description: 'CSV is downloading.' });
      }
    } catch (err) {
      console.error('Export failed', err);
      toast({ title: 'Error', description: 'Failed to export CSV', variant: 'destructive' });
    }
  };

  const handleRetryFailed = async (id) => {
    try {
      const res = await jobsAPI.retryFailed(id, { limit: 100 });
      if (res.success) {
        toast({ title: 'Retry scheduled', description: `Retried ${res.data?.retried || '0'} submissions.` });
        loadJobs();
      }
    } catch (err) {
      console.error('Retry failed', err);
      toast({ title: 'Error', description: 'Failed to retry failed submissions', variant: 'destructive' });
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await jobsAPI.cancelJob(id);
      if (res.success) {
        toast({ title: 'Job cancelled' });
        loadJobs();
      }
    } catch (err) {
      console.error('Cancel failed', err);
      toast({ title: 'Error', description: 'Failed to cancel job', variant: 'destructive' });
    }
  };

  const handleRecompute = async (id) => {
    try {
      const res = await jobsAPI.recomputeCounts(id);
      if (res.success) {
        toast({ title: 'Counts recomputed' });
        loadJobs();
      }
    } catch (err) {
      console.error('Recompute failed', err);
      toast({ title: 'Error', description: 'Failed to recompute counts', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      const res = await jobsAPI.deleteJob(id);
      if (res.success) {
        toast({ title: 'Job deleted' });
        loadJobs();
      }
    } catch (err) {
      console.error('Delete failed', err);
      toast({ title: 'Error', description: 'Failed to delete job', variant: 'destructive' });
    }
  };

  const handleViewSubmissions = (id) => {
    navigate(`/submissions?jobId=${id}`);
  };

  if (loading) return <div>Loading jobs...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Jobs</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreate(true)}>Create Job</Button>
        </div>
      </div>
      <CreateJobModal isOpen={showCreate} onClose={() => setShowCreate(false)} onCreated={(j) => { loadJobs(); }} />
      {jobs.map((job) => (
        <Card key={job.id}>
          <CardHeader>
            <CardTitle className="flex justify-between">
              {job.name}
              <div className="flex items-center gap-3">
                <Badge variant={job.status === 'completed' ? 'default' : 'secondary'}>
                  {job.status}
                </Badge>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleExport(job.id, job.name)}>Export CSV</Button>
                  <Button size="sm" onClick={() => handleRetryFailed(job.id)}>Retry Failed</Button>
                  <Button size="sm" onClick={() => handleCancel(job.id)} variant="destructive">Cancel</Button>
                  <Button size="sm" onClick={() => handleRecompute(job.id)}>Recompute</Button>
                  <Button size="sm" onClick={() => handleViewSubmissions(job.id)}>View Submissions</Button>
                  <Button size="sm" onClick={() => handleDelete(job.id)} variant="destructive">Delete</Button>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>Total: {job.counts.total}</div>
              <div>Success: {job.counts.success}</div>
              <div>Failed: {job.counts.failed}</div>
              <div>Running: {job.counts.running}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}