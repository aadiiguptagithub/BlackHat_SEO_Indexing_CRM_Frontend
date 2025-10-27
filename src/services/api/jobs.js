import api from '../../lib/api';
import { adaptJob, adaptSubmission, adaptPagination } from '../../lib/adapters';

export const jobsAPI = {
  // Get all jobs
  getJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return {
      ...response,
      data: response.data?.map(adaptJob) || [],
      pagination: adaptPagination(response.pagination || {})
    };
  },
  
  // Get job by ID
  getJob: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return {
      ...response,
      data: response.data ? adaptJob(response.data) : null
    };
  },
  
  // Create new job
  createJob: (data) => api.post('/jobs', data),
  
  // Get job submissions
  getJobSubmissions: async (id, params = {}) => {
    const response = await api.get(`/jobs/${id}/submissions`, { params });
    return {
      ...response,
      data: response.data?.data?.map(adaptSubmission) || response.data?.map(adaptSubmission) || [],
      pagination: adaptPagination(response.pagination || {})
    };
  },
  
  // Retry failed submissions
  retryFailed: (id, data = {}) => api.post(`/jobs/${id}/retry-failed`, data),
  
  // Cancel job
  cancelJob: (id) => api.post(`/jobs/${id}/cancel`),
  
  // Recompute counts
  recomputeCounts: (id) => api.post(`/jobs/${id}/recompute-counts`),
  
  // Export job data
  exportJob: (id) => api.get(`/jobs/${id}/export.csv`, { responseType: 'blob' }),
  
  // Delete job
  deleteJob: (id) => api.delete(`/jobs/${id}`)
};