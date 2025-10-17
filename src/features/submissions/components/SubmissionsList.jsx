import { useState, useEffect } from 'react';
import { submissionsAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function SubmissionsList({ jobId }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (jobId) {
      loadSubmissions();
    }
  }, [jobId]);

  const loadSubmissions = async () => {
    try {
      // This would use jobsAPI.getJobSubmissions in a real implementation
      // For now, showing the structure
      setSubmissions([]);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const claimNext = async () => {
    setClaiming(true);
    try {
      const response = await submissionsAPI.claimNext();
      if (response.success && response.data) {
        console.log('Claimed submission:', response.data);
        // Handle claimed submission
      } else {
        console.log('No submissions available');
      }
    } catch (error) {
      console.error('Failed to claim submission:', error);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Submissions</h2>
        <Button onClick={claimNext} disabled={claiming}>
          {claiming ? 'Claiming...' : 'Claim Next'}
        </Button>
      </div>
      
      {loading ? (
        <div>Loading submissions...</div>
      ) : (
        submissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                {submission.websiteUrl}
                <Badge variant={
                  submission.status === 'success' ? 'default' : 
                  submission.status === 'failed' ? 'destructive' : 'secondary'
                }>
                  {submission.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div>Attempt: {submission.attempt}</div>
                {submission.error && <div className="text-red-600">Error: {submission.error}</div>}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}