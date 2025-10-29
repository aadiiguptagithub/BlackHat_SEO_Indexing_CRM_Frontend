import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { jobsAPI } from '@/services/api';
import api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

export default function CreateJobModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('');
  const [websiteIds, setWebsiteIds] = useState('');
  const [websites, setWebsites] = useState([]);
  const [showWebsites, setShowWebsites] = useState(false);
  const [loadingWebsites, setLoadingWebsites] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setMessageTemplate('');
      setWebsiteIds('');
      setWebsites([]);
      setShowWebsites(false);
      setSubmitting(false);
    } else {
      loadWebsites();
    }
  }, [isOpen]);

  const loadWebsites = async () => {
    if (websites.length > 0) return; // Don't reload if already loaded
    
    setLoadingWebsites(true);
    try {
      const response = await api.get('/websites');
      console.log('Websites response:', response);
      
      if (response.success) {
        const websitesData = response.data?.data || response.data || [];
        const validWebsites = Array.isArray(websitesData) ? websitesData : [];
        setWebsites(validWebsites);
        
        // Pre-select all active websites
        const activeWebsites = validWebsites.filter(w => w.isActive !== false);
        const activeIds = activeWebsites.map(w => w._id || w.id).join(',');
        setWebsiteIds(activeIds);
        
        console.log('Loaded websites:', validWebsites);
        console.log('Pre-selected active websites:', activeIds);
      } else {
        console.error('API returned success: false', response);
        setWebsites([]);
      }
    } catch (error) {
      console.error('Failed to load websites:', error);
      setWebsites([]);
    } finally {
      setLoadingWebsites(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const ids = websiteIds
        .split(/[,\n]+/)
        .map(s => s.trim())
        .filter(Boolean);

      if (ids.length === 0) {
        toast({ title: 'Error', description: 'Please select at least one website', variant: 'destructive' });
        return;
      }

      const payload = {
        name,
        messageTemplate,
        websiteIds: ids,
      };

      console.log('Creating job with payload:', payload);
      const res = await jobsAPI.createJob(payload);
      console.log('Create job response:', res);
      
      if (res.success) {
        toast({ title: 'Success', description: 'Job created successfully' });
        onCreated && onCreated(res.data);
        onClose();
      } else {
        console.error('Create job failed', res.message);
        toast({ title: 'Error', description: res.message || 'Failed to create job', variant: 'destructive' });
      }
    } catch (err) {
      console.error('Create job error:', err);
      toast({ title: 'Error', description: 'Failed to create job. Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm">Message Template</label>
            <Textarea value={messageTemplate} onChange={e => setMessageTemplate(e.target.value)} rows={4} />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm">Website IDs (comma or newline separated)</label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  if (!showWebsites) {
                    loadWebsites();
                  }
                  setShowWebsites(!showWebsites);
                }}
                disabled={loadingWebsites}
              >
                {loadingWebsites ? 'Loading...' : showWebsites ? 'Hide' : 'Show'} Websites
              </Button>
            </div>
            <Textarea value={websiteIds} onChange={e => setWebsiteIds(e.target.value)} rows={3} placeholder="Enter website IDs..." />
            {showWebsites && (
              <Card className="mt-2 max-h-40 overflow-y-auto">
                <CardContent className="p-2">
                  {loadingWebsites ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
                      <div className="text-xs text-gray-600 mt-1">Loading websites...</div>
                    </div>
                  ) : websites.length > 0 ? (
                    <>
                      <div className="text-xs text-gray-600 mb-2">Click ID to add ({websites.length} websites):</div>
                      {websites.map((website) => (
                        <div key={website._id || website.id} className="flex justify-between items-center text-xs p-1 hover:bg-gray-50 rounded">
                          <span className="truncate flex-1 mr-2" title={website.url}>{website.url}</span>
                          <button
                            type="button"
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                            onClick={() => {
                              const id = website._id || website.id;
                              const current = websiteIds.trim();
                              setWebsiteIds(current ? `${current},${id}` : id);
                            }}
                            title={`Add ${website._id || website.id}`}
                          >
                            {(website._id || website.id).toString().slice(-8)}
                          </button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-4 text-xs text-gray-500">
                      No websites found. Add websites first.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Job'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
