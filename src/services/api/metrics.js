import api from './index';

export const metricsAPI = {
  // Get system metrics
  getMetrics: () => api.get('/metrics')
};