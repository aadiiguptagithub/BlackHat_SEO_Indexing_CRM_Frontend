import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Plus, RefreshCw, Search, ChevronLeft, ChevronRight, Download, RotateCcw, Calculator, Eye } from 'lucide-react';
import { FaBriefcase, FaCheckCircle, FaSpinner, FaClock } from 'react-icons/fa';
import CreateJobModal from './CreateJobModal';

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [recomputing, setRecomputing] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getJobs();
      if (response.success) {
        setJobs(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
      toast({ title: 'Error', description: 'Failed to load jobs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (id, name) => {
    try {
      const res = await jobsAPI.exportJob(id);
      if (res.success) {
        const blob = res.data;
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name || 'job'}-${id}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast({ title: 'Export started', description: 'CSV is downloading.' });
      }
    } catch (err) {
      console.error('Export failed', err);
      toast({ title: 'Error', description: 'Failed to export CSV', variant: 'destructive' });
    }
  };

  const handleRetryFailed = async (id) => {
    try {
      const res = await jobsAPI.retryFailed(id, { limit: 100 });
      if (res.success) {
        toast({ title: 'Retry scheduled', description: `Retried ${res.data?.retried || '0'} submissions.` });
        loadJobs();
      }
    } catch (err) {
      console.error('Retry failed', err);
      toast({ title: 'Error', description: 'Failed to retry failed submissions', variant: 'destructive' });
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await jobsAPI.cancelJob(id);
      if (res.success) {
        toast({ title: 'Job cancelled' });
        loadJobs();
      }
    } catch (err) {
      console.error('Cancel failed', err);
      toast({ title: 'Error', description: 'Failed to cancel job', variant: 'destructive' });
    }
  };

  const handleRecompute = async (id) => {
    try {
      setRecomputing(id);
      const res = await jobsAPI.recomputeCounts(id);
      if (res.success) {
        toast({ title: 'Counts recomputed' });
        await loadJobs();
      }
    } catch (err) {
      console.error('Recompute failed', err);
      toast({ title: 'Error', description: 'Failed to recompute counts', variant: 'destructive' });
    } finally {
      setRecomputing(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      const res = await jobsAPI.deleteJob(id);
      if (res.success) {
        toast({ title: 'Job deleted' });
        loadJobs();
      }
    } catch (err) {
      console.error('Delete failed', err);
      toast({ title: 'Error', description: 'Failed to delete job', variant: 'destructive' });
    }
  };

  const handleViewSubmissions = (id) => {
    navigate(`/submissions?jobId=${id}`);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} jobs?`)) return;
    
    try {
      await Promise.all(selectedIds.map(id => jobsAPI.deleteJob(id)));
      setJobs(jobs.filter(j => !selectedIds.includes(j.id)));
      setSelectedIds([]);
      toast({ title: 'Success', description: `${selectedIds.length} jobs deleted successfully` });
    } catch (error) {
      console.error('Failed to delete jobs:', error);
      toast({ title: 'Error', description: 'Failed to delete some jobs', variant: 'destructive' });
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedJobs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedJobs.map(j => j.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus = job.status?.toLowerCase() === statusFilter.toLowerCase();
    }
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchQuery, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#013763] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Management</h2>
          <p className="text-gray-600 mt-1">Manage and monitor your SEO automation jobs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadJobs} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Job
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FaBriefcase className="w-8 h-8 text-[#013763]" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FaCheckCircle className="w-8 h-8 text-[#013763]" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobs.filter(j => j.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FaSpinner className="w-8 h-8 text-[#013763]" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Running</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobs.filter(j => j.status === 'running').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FaClock className="w-8 h-8 text-[#013763]" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobs.filter(j => j.status === 'pending' || j.status === 'queued').length}
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
                placeholder="Search by job name..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="queued">Queued</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {paginatedJobs.length} of {filteredJobs.length} jobs
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

      <CreateJobModal isOpen={showCreate} onClose={() => setShowCreate(false)} onCreated={() => loadJobs()} />
      
      {/* Jobs Table */}
      {filteredJobs.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FaBriefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {jobs.length === 0 ? 'No jobs created yet' : 'No jobs match your filters'}
          </h3>
          <p className="text-gray-600 mb-4">
            {jobs.length === 0 
              ? 'Create your first job to start automating SEO submissions'
              : 'Try adjusting your search or filter criteria'}
          </p>
          {jobs.length === 0 && (
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Job
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
                      checked={selectedIds.length === paginatedJobs.length && paginatedJobs.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Job Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Success</TableHead>
                  <TableHead>Failed</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedJobs.map((job, index) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(job.id)}
                        onCheckedChange={() => toggleSelect(job.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                    <TableCell className="font-medium text-gray-900">{job.name}</TableCell>
                    <TableCell>
                      <Badge variant={
                        job.status === 'completed' ? 'default' : 
                        job.status === 'running' ? 'secondary' :
                        job.status === 'failed' ? 'destructive' :
                        'outline'
                      }>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-green-600 font-medium">{job.counts.success}</TableCell>
                    <TableCell className="text-red-600 font-medium">{job.counts.failed}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewSubmissions(job.id)}
                          title="View Submissions"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRecompute(job.id)}
                          disabled={recomputing === job.id}
                          title="Recompute Counts"
                        >
                          {recomputing === job.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#013763]"></div>
                          ) : (
                            <Calculator className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExport(job.id, job.name)}
                          title="Export CSV"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRetryFailed(job.id)}
                          title="Retry Failed"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(job.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete Job"
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
