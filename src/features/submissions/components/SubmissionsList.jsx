import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { jobsAPI, submissionsAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ClaimSubmissionModal from './ClaimSubmissionModal';

export default function SubmissionsList({ jobId: propJobId }) {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const jobId = propJobId || query.get('jobId');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimedSubmission, setClaimedSubmission] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const { toast } = useToast();

  const loadByJob = async () => {
    if (!jobId) return;
    console.log('Loading submissions for job:', jobId);
    setLoading(true);
    try {
      const res = await jobsAPI.getJobSubmissions(jobId);
      console.log('Job submissions response:', res);
      if (res.success) {
        setSubmissions(res.data || []);
        console.log('Loaded submissions:', res.data);
      } else {
        console.error('Failed to load job submissions:', res.message);
        toast({ title: 'Error', description: res.message || 'Failed to load submissions', variant: 'destructive' });
      }
    } catch (err) {
      console.error('Failed to load job submissions', err);
      toast({ title: 'Error', description: 'Failed to load submissions', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      loadByJob();
    } else {
      loadSubmissions();
    }
  }, [jobId]);

  const loadSubmissions = async () => {
    console.log('Loading all submissions...');
    setLoading(true);
    try {
      const jobsRes = await jobsAPI.getJobs();
      console.log('Jobs response:', jobsRes);
      
      if (jobsRes.success && jobsRes.data) {
        console.log('Found jobs:', jobsRes.data.length);
        
        if (jobsRes.data.length === 0) {
          console.log('No jobs found');
          setSubmissions([]);
          return;
        }
        
        const allSubmissions = [];
        for (const job of jobsRes.data.slice(0, 5)) {
          console.log('Loading submissions for job:', job.id, job.name);
          try {
            const submissionsRes = await jobsAPI.getJobSubmissions(job.id, { limit: 20 });
            console.log(`Submissions for job ${job.id}:`, submissionsRes);
            if (submissionsRes.success) {
              allSubmissions.push(...(submissionsRes.data || []));
            }
          } catch (err) {
            console.error(`Failed to load submissions for job ${job.id}:`, err);
          }
        }
        console.log('Total submissions loaded:', allSubmissions.length);
        setSubmissions(allSubmissions);
      } else {
        console.error('Failed to load jobs:', jobsRes.message);
        toast({ title: 'Error', description: 'Failed to load jobs', variant: 'destructive' });
        setSubmissions([]);
      }
    } catch (error) {
      console.error('Failed to load submissions:', error);
      toast({ title: 'Error', description: 'Failed to load submissions', variant: 'destructive' });
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const claimNext = async () => {
    setClaiming(true);
    try {
      const res = await submissionsAPI.claimNext(120);
      if (res.success && res.data) {
        console.log('Claimed submission:', res.data);
        setClaimedSubmission(res.data);
        setShowClaimModal(true);
        toast({ title: 'Submission claimed', description: 'You can now process this submission.' });
      } else {
        toast({ title: 'No submissions available', description: 'All submissions are currently being processed.' });
      }
    } catch (error) {
      console.error('Failed to claim submission:', error);
      toast({ title: 'Error', description: 'Failed to claim submission. Please try again.', variant: 'destructive' });
    } finally {
      setClaiming(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    try {
      const res = await submissionsAPI.deleteSubmission(id);
      if (res.success) {
        toast({ title: 'Submission deleted' });
        jobId ? loadByJob() : loadSubmissions();
      }
    } catch (err) {
      console.error('Delete failed', err);
      toast({ title: 'Error', description: 'Failed to delete submission', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Submissions</h2>
        <div className="flex gap-2">
          <Button onClick={() => { jobId ? loadByJob() : loadSubmissions(); }}>Refresh</Button>
          <Button onClick={claimNext} disabled={claiming}>
            {claiming ? 'Claiming...' : 'Claim Next'}
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#013763] mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading submissions...</p>
          </div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          <p>No submissions found. Create a job to see submissions here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission._id || submission.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {submission.websiteId?.url || submission.websiteUrl || 'Unknown Website'}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Job: {submission.jobId?.name || submission.jobName || 'Unknown Job'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      submission.status === 'success' ? 'default' : 
                      submission.status === 'failed' ? 'destructive' : 
                      submission.status === 'running' ? 'secondary' :
                      'outline'
                    }>
                      {submission.status || 'pending'}
                    </Badge>
                    <Button size="sm" onClick={() => handleDelete(submission._id || submission.id)} variant="destructive">Delete</Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Attempt:</span>
                    <div className="text-gray-900">{submission.attempt || 1}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Updated:</span>
                    <div className="text-gray-900">
                      {submission.updatedAt ? new Date(submission.updatedAt).toLocaleString() : 
                       submission.createdAt ? new Date(submission.createdAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Evidence:</span>
                    <div className="text-gray-900">
                      {submission.evidence?.htmlPath && (
                        <a 
                          href={`http://localhost:4000/api/submissions/evidence/${submission.jobId?._id || submission.jobId}/${submission._id || submission.id}/response.html`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                          onClick={(e) => {
                            const jobId = submission.jobId?._id || submission.jobId;
                            const subId = submission._id || submission.id;
                            if (!jobId || !subId) {
                              e.preventDefault();
                              alert('Missing job or submission ID');
                              console.log('Submission data:', submission);
                            }
                          }}
                        >
                          View HTML
                        </a>
                      )}
                      {!submission.evidence?.htmlPath && 'None'}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Lease:</span>
                    <div className="text-gray-900">
                      {submission.leaseUntil && new Date(submission.leaseUntil) > new Date() ? 'Active' : 'None'}
                    </div>
                  </div>
                </div>
                {submission.lastError && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                    <span className="text-sm font-medium text-red-800">Error:</span>
                    <div className="text-sm text-red-700 mt-1">{submission.lastError}</div>
                  </div>
                )}
                {submission.logs && submission.logs.length > 0 && (
                  <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded">
                    <span className="text-sm font-medium text-gray-800">Logs:</span>
                    <div className="text-sm text-gray-700 mt-1">
                      {submission.logs.slice(-3).map((log, index) => (
                        <div key={index}>• {log}</div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <ClaimSubmissionModal
        isOpen={showClaimModal}
        onClose={() => { setShowClaimModal(false); setClaimedSubmission(null); }}
        submission={claimedSubmission}
        onReported={() => { jobId ? loadByJob() : loadSubmissions(); setShowClaimModal(false); setClaimedSubmission(null); }}
      />
    </div>
  );
}