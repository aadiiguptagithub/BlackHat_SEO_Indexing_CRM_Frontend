import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submissionsAPI, jobsAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function SubmissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSubmission();
  }, [id]);

  const loadSubmission = async () => {
    setLoading(true);
    try {
      // Get all jobs and find submission
      const jobsRes = await jobsAPI.getJobs();
      if (jobsRes.success && jobsRes.data) {
        for (const job of jobsRes.data) {
          const submissionsRes = await jobsAPI.getJobSubmissions(job.id);
          if (submissionsRes.success) {
            const found = submissionsRes.data.find(s => (s._id || s.id) === id);
            if (found) {
              setSubmission(found);
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load submission:', error);
      toast({ title: 'Error', description: 'Failed to load submission details', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#013763]"></div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Submission not found</p>
        <Button onClick={() => navigate('/submissions')} className="mt-4">
          Back to Submissions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/submissions')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Submission Details</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Website URL</label>
                <p className="text-gray-900 break-all">{submission.websiteId?.url || submission.websiteUrl || 'Unknown'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Job Name</label>
                <p className="text-gray-900">{submission.jobId?.name || submission.jobName || 'Unknown'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <Badge variant={
                  submission.status === 'success' ? 'default' : 
                  submission.status === 'failed' ? 'destructive' : 
                  submission.status === 'running' ? 'secondary' : 'outline'
                }>
                  {submission.status || 'pending'}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Attempt</label>
                <p className="text-gray-900">{submission.attempt || 1}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="text-gray-900">{submission.createdAt ? new Date(submission.createdAt).toLocaleString() : 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Updated At</label>
                <p className="text-gray-900">{submission.updatedAt ? new Date(submission.updatedAt).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evidence</CardTitle>
          </CardHeader>
          <CardContent>
            {submission.evidence?.htmlPath ? (
              <a
                href={`http://localhost:4000/api/submissions/evidence/${submission.jobId?._id || submission.jobId}/${submission._id || submission.id}/response.html`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                View HTML Response
              </a>
            ) : (
              <p className="text-gray-500">No evidence available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {submission.lastError && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error Details</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-red-50 p-4 rounded text-sm text-red-800 overflow-x-auto">
              {submission.lastError}
            </pre>
          </CardContent>
        </Card>
      )}

      {submission.logs && submission.logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Execution Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded space-y-1 max-h-96 overflow-y-auto">
              {submission.logs.map((log, index) => (
                <div key={index} className="text-sm text-gray-700 font-mono">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
