import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jobsAPI, submissionsAPI } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, RefreshCw, Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { FaCheckCircle, FaTimesCircle, FaClock, FaSpinner } from 'react-icons/fa';

export default function SubmissionsList({ jobId: propJobId }) {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const jobId = propJobId || query.get('jobId');
  
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadSubmissions();
  }, [jobId]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      if (jobId) {
        const res = await jobsAPI.getJobSubmissions(jobId);
        if (res.success) {
          setSubmissions(res.data || []);
        }
      } else {
        const jobsRes = await jobsAPI.getJobs();
        if (jobsRes.success && jobsRes.data) {
          const allSubmissions = [];
          for (const job of jobsRes.data.slice(0, 10)) {
            try {
              const submissionsRes = await jobsAPI.getJobSubmissions(job.id, { limit: 50 });
              if (submissionsRes.success) {
                allSubmissions.push(...(submissionsRes.data || []));
              }
            } catch (err) {
              console.error(`Failed to load submissions for job ${job.id}:`, err);
            }
          }
          setSubmissions(allSubmissions);
        }
      }
    } catch (error) {
      console.error('Failed to load submissions:', error);
      toast({ title: 'Error', description: 'Failed to load submissions', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    try {
      const res = await submissionsAPI.deleteSubmission(id);
      if (res.success) {
        toast({ title: 'Submission deleted' });
        loadSubmissions();
      }
    } catch (err) {
      console.error('Delete failed', err);
      toast({ title: 'Error', description: 'Failed to delete submission', variant: 'destructive' });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} submissions?`)) return;
    
    try {
      await Promise.all(selectedIds.map(id => submissionsAPI.deleteSubmission(id)));
      setSubmissions(submissions.filter(s => !selectedIds.includes(s._id || s.id)));
      setSelectedIds([]);
      toast({ title: 'Success', description: `${selectedIds.length} submissions deleted successfully` });
    } catch (error) {
      console.error('Failed to delete submissions:', error);
      toast({ title: 'Error', description: 'Failed to delete some submissions', variant: 'destructive' });
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedSubmissions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedSubmissions.map(s => s._id || s.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = (submission.websiteId?.url || submission.websiteUrl || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (submission.jobId?.name || submission.jobName || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus = submission.status?.toLowerCase() === statusFilter.toLowerCase();
    }
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchQuery, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#013763] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Submission Management</h2>
          <p className="text-gray-600 mt-1">Track and monitor your SEO submission results</p>
        </div>
        <Button variant="outline" onClick={loadSubmissions} disabled={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FaCheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.status === 'success').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FaTimesCircle className="w-8 h-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.status === 'failed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FaSpinner className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Running</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.status === 'running').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FaClock className="w-8 h-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.status === 'pending' || !s.status).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by website or job..."
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
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {paginatedSubmissions.length} of {filteredSubmissions.length} submissions
            </div>
            {selectedIds.length > 0 && (
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete {selectedIds.length} Selected
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      {filteredSubmissions.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No submissions found</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedIds.length === paginatedSubmissions.length && paginatedSubmissions.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Attempt</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSubmissions.map((submission, index) => (
                  <TableRow key={submission._id || submission.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(submission._id || submission.id)}
                        onCheckedChange={() => toggleSelect(submission._id || submission.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                    <TableCell className="max-w-xs truncate" title={submission.websiteId?.url || submission.websiteUrl}>
                      {submission.websiteId?.url || submission.websiteUrl || 'Unknown'}
                    </TableCell>
                    <TableCell>{submission.jobId?.name || submission.jobName || 'Unknown'}</TableCell>
                    <TableCell>
                      <Badge variant={
                        submission.status === 'success' ? 'default' : 
                        submission.status === 'failed' ? 'destructive' : 
                        submission.status === 'running' ? 'secondary' : 'outline'
                      }>
                        {submission.status || 'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>{submission.attempt || 1}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {submission.updatedAt ? new Date(submission.updatedAt).toLocaleDateString() : 
                       submission.createdAt ? new Date(submission.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/submissions/${submission._id || submission.id}`)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(submission._id || submission.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
