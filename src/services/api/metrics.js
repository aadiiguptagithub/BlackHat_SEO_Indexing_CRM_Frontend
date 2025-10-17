import api from '../../lib/api';
import { adaptMetrics } from '../../lib/adapters';

export const metricsAPI = {
  // Get system metrics
  getMetrics: async () => {
    const response = await api.get('/metrics');
    return {
      ...response,
      data: response.data ? adaptMetrics(response.data) : null
    };
  }
};