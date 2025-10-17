import axiosInstance from "../../config/axios";

export const ipSettingsAPI = {
  // Get all IP addresses
  getIpAddresses: async () => {
    const response = await axiosInstance.get("/public/api/ip-addresses");
    return response.data;
  },

  // Add new IP address
  addIpAddress: async (data) => {
    const response = await axiosInstance.post("/public/api/ip-addresses", data);
    return response.data;
  },

  // Update security status for all IPs
  updateSecurityStatus: async (status) => {
    const response = await axiosInstance.patch(
      "/public/api/ip-addresses/security-status/update-all",
      {
        security_status: status ? "1" : "0",
      }
    );
    return response.data;
  },

  // Get IP addresses summary
  getIpSummary: async () => {
    const response = await axiosInstance.get(
      "/public/api/ip-addresses/status/summary"
    );
    return response.data;
  },

  // Update single IP address status
  updateIpStatus: async (id, status) => {
    const response = await axiosInstance.patch(
      `/public/api/ip-addresses/${id}/status`,
      {
        status: status === "Allowed" ? "1" : "0",
      }
    );
    return response.data;
  },

  // Delete IP address
  deleteIpAddress: async (id) => {
    const response = await axiosInstance.delete(
      `/public/api/ip-addresses/${id}`
    );
    return response.data;
  },

  // Update IP address
  updateIpAddress: async (id, data) => {
    const response = await axiosInstance.put(
      `/public/api/ip-addresses/${id}`,
      data
    );
    return response.data;
  },
};
