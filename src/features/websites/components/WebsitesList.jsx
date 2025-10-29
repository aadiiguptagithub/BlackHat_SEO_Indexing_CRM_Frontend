import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { websitesAPI } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Globe, Trash2, Plus, RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import BulkUploadModal from './BulkUploadModal';

export default function WebsitesList() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showBulk, setShowBulk] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
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
      const response = await websitesAPI.deleteWebsite(id);
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

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setToggling(id);
      const response = await websitesAPI.toggleStatus(id);
      if (response.success) {
        setWebsites(websites.map(w => 
          w._id === id ? { ...w, isActive: response.data.isActive } : w
        ));
        toast({ 
          title: 'Success', 
          description: `Website ${response.data.isActive ? 'activated' : 'deactivated'} successfully` 
        });
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    } finally {
      setToggling(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} websites?`)) return;
    
    try {
      await Promise.all(selectedIds.map(id => websitesAPI.deleteWebsite(id)));
      setWebsites(websites.filter(w => !selectedIds.includes(w._id)));
      setSelectedIds([]);
      toast({ title: 'Success', description: `${selectedIds.length} websites deleted successfully` });
    } catch (error) {
      console.error('Failed to delete websites:', error);
      toast({ title: 'Error', description: 'Failed to delete some websites', variant: 'destructive' });
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedWebsites.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedWebsites.map(w => w._id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredWebsites = websites.filter(website => {
    const matchesSearch = website.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         website.host?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && website.isActive !== false) ||
                         (statusFilter === 'inactive' && website.isActive === false);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredWebsites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWebsites = filteredWebsites.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchQuery, statusFilter]);

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

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by URL or host..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {paginatedWebsites.length} of {filteredWebsites.length} websites
            </div>
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete {selectedIds.length} Selected
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <BulkUploadModal 
        isOpen={showBulk} 
        onClose={() => setShowBulk(false)} 
        onUploaded={async () => {
          await loadWebsites();
        }} 
      />
      
      {/* Websites Table */}
      {filteredWebsites.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {websites.length === 0 ? 'No websites added yet' : 'No websites match your filters'}
          </h3>
          <p className="text-gray-600 mb-4">
            {websites.length === 0 
              ? 'Start by uploading your target websites for SEO campaigns'
              : 'Try adjusting your search or filter criteria'}
          </p>
          {websites.length === 0 && (
            <Button onClick={() => setShowBulk(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Websites
            </Button>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedIds.length === paginatedWebsites.length && paginatedWebsites.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Added Date</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedWebsites.map((website, index) => (
                  <TableRow key={website._id || website.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(website._id)}
                        onCheckedChange={() => toggleSelect(website._id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                    <TableCell className="max-w-xs truncate" title={website.url}>
                      {website.url}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 text-[#013763] mr-2" />
                        {website.host || (website.url ? new URL(website.url).hostname : 'Unknown')}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {website.createdAt ? new Date(website.createdAt).toLocaleDateString() : 'Unknown'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant={website.isActive !== false ? 'default' : 'outline'}
                        onClick={() => handleToggleStatus(website._id || website.id, website.isActive)}
                        disabled={toggling === (website._id || website.id)}
                        className={website.isActive !== false 
                          ? 'bg-[#013763] hover:bg-[#001f3f] text-white' 
                          : 'bg-[#bd171f] hover:bg-[#9e1419] text-white'}
                      >
                        {toggling === (website._id || website.id) ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                        ) : (
                          website.isActive !== false ? 'Active' : 'Inactive'
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}