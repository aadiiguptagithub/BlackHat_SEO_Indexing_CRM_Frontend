import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { submissionsAPI } from '@/services/api';

export default function ClaimSubmissionModal({ isOpen, onClose, submission, onReported }) {
  const [logs, setLogs] = useState('');
  const [errorText, setErrorText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setLogs('');
      setErrorText('');
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleSuccess = async () => {
    if (!submission) return;
    const submissionId = submission._id || submission.id;
    if (!submissionId) {
      console.error('No submission ID found:', submission);
      alert('Error: Submission ID is missing');
      return;
    }
    setSubmitting(true);
    try {
      const res = await submissionsAPI.reportSuccess(submissionId, { logs: logs.split('\n').filter(Boolean), evidence: {} });
      console.log('Report success response:', res);
      if (res.success) {
        onReported && onReported(res.data);
        onClose();
      }
    } catch (err) {
      console.error('Report success error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFailure = async () => {
    if (!submission) return;
    const submissionId = submission._id || submission.id;
    if (!submissionId) {
      console.error('No submission ID found:', submission);
      alert('Error: Submission ID is missing');
      return;
    }
    setSubmitting(true);
    try {
      const res = await submissionsAPI.reportFailure(submissionId, errorText, logs.split('\n').filter(Boolean));
      if (res.success) {
        onReported && onReported(res.data);
        onClose();
      }
    } catch (err) {
      console.error('Report failure error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!submission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={val => { if(!val) onClose(); }}>
      <div className="p-4 w-[640px]">
        <h3 className="text-lg font-medium">Report Submission</h3>
        <div className="mt-2 text-sm">Website: {submission.websiteId?.url || submission.websiteUrl || 'Unknown'}</div>
        <div className="mt-3 space-y-2">
          <div>
            <label className="block text-sm">Logs (one per line)</label>
            <Textarea value={logs} onChange={e => setLogs(e.target.value)} rows={4} />
          </div>
          <div>
            <label className="block text-sm">Error message (if failed)</label>
            <Textarea value={errorText} onChange={e => setErrorText(e.target.value)} rows={2} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleFailure} disabled={submitting || !errorText}>Report Failure</Button>
          <Button onClick={handleSuccess} disabled={submitting}>Report Success</Button>
        </div>
      </div>
    </Dialog>
  );
}
