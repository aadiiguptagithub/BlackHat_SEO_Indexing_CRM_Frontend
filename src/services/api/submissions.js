import api from '../../lib/api';
import { adaptSubmission } from '../../lib/adapters';

export const submissionsAPI = {
  // Claim next submission (worker endpoint)
  claimNext: async (lease = 120) => {
    const response = await api.get(`/submissions/next?lease=${lease}`);
    console.log('Claim next raw response:', response);
    if (!response.success || !response.data) {
      return { success: false, data: null, message: response.message || 'No submissions available' };
    }
    const adapted = adaptSubmission(response.data);
    console.log('Adapted submission:', adapted);
    return {
      success: true,
      data: adapted
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
  }),
  
  // Delete submission
  deleteSubmission: (id) => api.delete(`/submissions/${id}`)
};