import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Globe, Trash2, Plus, RefreshCw } from 'lucide-react';
import BulkUploadModal from './BulkUploadModal';

export default function WebsitesList() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showBulk, setShowBulk] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/websites');
      console.log('Websites API response:', response);
      
      if (response.success) {
        // Handle different response structures
        const websitesData = response.data?.data || response.data || [];
        const paginationData = response.data?.pagination || {};
        
        setWebsites(Array.isArray(websitesData) ? websitesData : []);
        setPagination(paginationData);
        
        console.log('Loaded websites:', websitesData);
      } else {
        console.error('API returned success: false');
        setWebsites([]);
      }
    } catch (error) {
      console.error('Failed to load websites:', error);
      toast({ title: 'Error', description: `Failed to load websites: ${error.message}`, variant: 'destructive' });
      setWebsites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this website?')) return;
    
    try {
      setDeleting(id);
      const response = await api.delete(`/websites/${id}`);
      if (response.success) {
        setWebsites(websites.filter(w => w._id !== id));
        toast({ title: 'Success', description: 'Website deleted successfully' });
      }
    } catch (error) {
      console.error('Failed to delete website:', error);
      toast({ title: 'Error', description: 'Failed to delete website', variant: 'destructive' });
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#013763] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading websites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Website Management</h2>
          <p className="text-gray-600 mt-1">Manage target websites for your SEO campaigns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadWebsites} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowBulk(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Globe className="w-8 h-8 text-[#013763]" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Websites</p>
                <p className="text-2xl font-bold text-gray-900">{websites.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Badge className="w-8 h-8 text-[#013763]" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Domains</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(websites.map(w => w.host)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Plus className="w-8 h-8 text-[#013763]" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Added Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {websites.filter(w => {
                    const today = new Date().toDateString();
                    return new Date(w.createdAt).toDateString() === today;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BulkUploadModal isOpen={showBulk} onClose={() => setShowBulk(false)} onUploaded={(data) => loadWebsites()} />
      
      {/* Websites List */}
      {websites.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No websites added yet</h3>
          <p className="text-gray-600 mb-4">Start by uploading your target websites for SEO campaigns</p>
          <Button onClick={() => setShowBulk(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Websites
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {websites.map((website) => (
            <Card key={website._id || website.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-2">
                      <Globe className="w-4 h-4 text-[#013763] mr-2 flex-shrink-0" />
                      <span className="font-medium text-gray-900 truncate">
                        {website.host || (website.url ? new URL(website.url).hostname : 'Unknown Host')}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {website.labels && website.labels.length > 0 ? website.labels[0] : 'Unlabeled'}
                    </Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(website._id || website.id)}
                    disabled={deleting === (website._id || website.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {deleting === (website._id || website.id) ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium text-gray-500">URL:</span>
                    <div className="text-sm text-gray-900 break-all">{website.url}</div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Added: {website.createdAt ? new Date(website.createdAt).toLocaleDateString() : 'Unknown'}</span>
                    <span>ID: {(website._id || website.id || 'unknown').toString().slice(-6)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}