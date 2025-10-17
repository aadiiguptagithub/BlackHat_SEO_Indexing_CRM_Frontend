import api from '../../lib/api';
import { adaptSubmission } from '../../lib/adapters';

export const submissionsAPI = {
  // Claim next submission (worker endpoint)
  claimNext: async (lease = 120) => {
    const response = await api.get(`/submissions/next?lease=${lease}`);
    return {
      ...response,
      data: response.data ? adaptSubmission(response.data) : null
    };
  },
  
  // Report submission success
  reportSuccess: (id, data) => api.patch(`/submissions/${id}`, {
    status: 'success',
    logs: data.logs || [],
    evidence: data.evidence || {}
  }),
  
  // Report submission failure
  reportFailure: (id, error, logs = []) => api.patch(`/submissions/${id}`, {
    status: 'failed',
    error,
    logs
  })
};