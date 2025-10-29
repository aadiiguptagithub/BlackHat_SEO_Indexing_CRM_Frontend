import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';

export default function BulkUploadModal({ isOpen, onClose, onUploaded }) {
  const [urlsText, setUrlsText] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setUrlsText('');
      setUploading(false);
    }
  }, [isOpen]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!urlsText.trim()) {
      toast({ title: 'Error', description: 'Please enter at least one URL', variant: 'destructive' });
      return;
    }
    
    setUploading(true);
    try {
      const urls = urlsText
        .split(/[,\n]+/)
        .map(s => s.trim())
        .filter(Boolean)
        .map(url => {
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `https://${url}`;
          }
          return url;
        })
        .filter(url => {
          try {
            new URL(url);
            return true;
          } catch {
            return false;
          }
        });

      if (urls.length === 0) {
        toast({ title: 'Error', description: 'No valid URLs found', variant: 'destructive' });
        setUploading(false);
        return;
      }

      console.log('Uploading URLs:', urls);
      const res = await api.post('/websites/bulk', { urls });
      
      if (res.success) {
        const data = res.data;
        toast({ 
          title: 'Upload successful', 
          description: `Added ${data.inserted || 0} websites, ${data.duplicates || 0} duplicates skipped` 
        });
        setUrlsText('');
        if (onUploaded) {
          await onUploaded(data);
        }
        onClose();
      } else {
        toast({ title: 'Error', description: res.message || 'Upload failed', variant: 'destructive' });
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast({ title: 'Error', description: `Upload failed: ${err.message}`, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Bulk Upload Websites</h2>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Website URLs (one per line)
            </label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={8}
              value={urlsText}
              onChange={(e) => setUrlsText(e.target.value)}
              placeholder="https://example.com&#10;https://test.com&#10;https://demo.org"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter URLs with or without https://. One URL per line.
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
