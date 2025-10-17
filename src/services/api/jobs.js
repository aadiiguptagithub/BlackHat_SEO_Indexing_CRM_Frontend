import api from '../../lib/api';

export const jobsAPI = {
  // Get all jobs
  getJobs: (params = {}) => api.get('/jobs', { params }),
  
  // Get job by ID
  getJob: (id) => api.get(`/jobs/${id}`),
  
  // Create new job
  createJob: (data) => api.post('/jobs', data),
  
  // Get job submissions
  getJobSubmissions: (id, params = {}) => api.get(`/jobs/${id}/submissions`, { params }),
  
  // Retry failed submissions
  retryFailed: (id, data = {}) => api.post(`/jobs/${id}/retry-failed`, data),
  
  // Cancel job
  cancelJob: (id) => api.post(`/jobs/${id}/cancel`),
  
  // Export job data
  exportJob: (id) => api.get(`/jobs/${id}/export.csv`, { responseType: 'blob' })
};