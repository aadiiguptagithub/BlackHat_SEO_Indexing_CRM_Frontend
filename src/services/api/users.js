import axiosInstance from "../../config/axios";

export const userAPI = {
  getUsers: async () => {
    const response = await axiosInstance.get("/api/users");
    return response.data;
  },

  createUser: async (userData) => {
    const response = await axiosInstance.post("/api/users", userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await axiosInstance.put(`/api/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/api/users/${id}`);
    return response.data;
  },

  toggleUserStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/api/users/${id}/status`, {
      status,
    });
    return response.data;
  },
};
