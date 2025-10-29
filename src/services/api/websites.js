import api from '../../lib/api';
import { adaptWebsite, adaptPagination } from '../../lib/adapters';

export const websitesAPI = {
  // Get all websites
  getWebsites: async (params = {}) => {
    const response = await api.get('/websites', { params });
    return {
      ...response,
      data: response.data?.map(adaptWebsite) || [],
      pagination: adaptPagination(response.pagination || {})
    };
  },
  
  // Bulk upload websites
  bulkUpload: (data) => api.post('/websites/bulk', data),
  
  // Toggle website status
  toggleStatus: (id) => api.patch(`/websites/${id}/toggle-status`),
  
  // Delete website
  deleteWebsite: (id) => api.delete(`/websites/${id}`)
};