import api from "../../lib/api";

export const authAPI = {
  login: async (credentials) => {
    return await api.post("/login", credentials);
  },

  verifyOTP: async (data) => {
    return await api.post("/verify-otp", data);
  },

  forgotPassword: async (email) => {
    return await api.post("/forgot-password", { email });
  },

  verifyPasswordOTP: async (data) => {
    return await api.post("/verify-password-otp", data);
  },

  resetPassword: async (data) => {
    return await api.post("/reset-password", data);
  },

  refreshToken: async (refreshToken) => {
    return await api.post("/refresh-token", { refreshToken });
  },

  resendOTP: async (data) => {
    return await api.post("/resend-otp", data);
  },
};
