import axiosInstance from "../../config/axios";

export const authAPI = {
  login: async (credentials) => {
    const response = await axiosInstance.post("/api/login", credentials);
    return response.data;
  },

  verifyOTP: async (data) => {
    const response = await axiosInstance.post("/api/verify-otp", data);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axiosInstance.post("/api/forgot-password", {
      email,
    });
    return response.data;
  },

  verifyPasswordOTP: async (data) => {
    const response = await axiosInstance.post("/api/verify-password-otp", data);
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await axiosInstance.post("/api/reset-password", data);
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await axiosInstance.post("/api/refresh-token", {
      refreshToken,
    });
    return response.data;
  },

  resendOTP: async (data) => {
    const response = await axiosInstance.post("/api/resend-otp", data);
    return response.data;
  },
};
