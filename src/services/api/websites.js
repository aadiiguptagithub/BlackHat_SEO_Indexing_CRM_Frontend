import api from '../../lib/api';

export const websitesAPI = {
  // Get all websites
  getWebsites: (params = {}) => api.get('/websites', { params }),
  
  // Bulk upload websites
  bulkUpload: (data) => api.post('/websites/bulk', data),
  
  // Delete website
  deleteWebsite: (id) => api.delete(`/websites/${id}`)
};