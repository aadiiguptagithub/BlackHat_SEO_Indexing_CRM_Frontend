import api from '../../lib/api';

export const metricsAPI = {
  // Get system metrics
  getMetrics: () => api.get('/metrics')
};