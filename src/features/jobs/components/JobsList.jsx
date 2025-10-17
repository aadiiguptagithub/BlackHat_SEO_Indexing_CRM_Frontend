import { useState, useEffect } from 'react';
import { jobsAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

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

  if (loading) return <div>Loading jobs...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Jobs</h2>
      {jobs.map((job) => (
        <Card key={job.id}>
          <CardHeader>
            <CardTitle className="flex justify-between">
              {job.name}
              <Badge variant={job.status === 'completed' ? 'default' : 'secondary'}>
                {job.status}
              </Badge>
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