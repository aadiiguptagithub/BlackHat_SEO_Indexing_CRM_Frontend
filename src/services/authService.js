import axios from "axios";

// Create axios instance with custom config
const api = axios.create({
  baseURL: process.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Handle response data consistency
const handleResponse = (response) => {
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data;
};

// Handle error consistency
const handleError = (error) => {
  if (error.response) {
    // Server responded with error status
    throw new Error(
      error.response.data.message ||
        error.response.data.error ||
        "Server error occurred"
    );
  } else if (error.request) {
    // Request made but no response
    throw new Error("No response from server. Please check your connection.");
  } else {
    // Error in request setup
    throw new Error(error.message || "An error occurred");
  }
};

/**
 * Login with email and password
 * @param {string} email User email
 * @param {string} password User password
 * @returns {Promise} Response containing user data and token
 */
export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Verify OTP code for login
 * @param {string} email User email
 * @param {string} otp OTP code
 * @returns {Promise} Response containing verification status
 */
export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post("/auth/verify-otp", {
      email,
      otp,
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Resend OTP code
 * @param {string} email User email
 * @returns {Promise} Response containing success status
 */
export const resendOTP = async (email) => {
  try {
    const response = await api.post("/auth/resend-otp", {
      email,
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Request password reset OTP
 * @param {string} email User email
 * @returns {Promise} Response containing success status
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", {
      email,
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Verify forgot password OTP code
 * @param {string} email User email
 * @param {string} otp OTP code
 * @returns {Promise} Response containing verification status
 */
export const verifyForgotOTP = async (email, otp) => {
  try {
    const response = await api.post("/auth/verify-forgot-otp", {
      email,
      otp,
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Reset password with new password
 * @param {string} email User email
 * @param {string} password New password
 * @param {string} token Reset token from email
 * @returns {Promise} Response containing success status
 */
export const resetPassword = async (email, password, token) => {
  try {
    const response = await api.post("/auth/reset-password", {
      email,
      password,
      token,
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Get current user profile
 * @returns {Promise} Response containing user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Update user profile
 * @param {Object} userData User profile data to update
 * @returns {Promise} Response containing updated user data
 */
export const updateProfile = async (userData) => {
  try {
    const response = await api.put("/auth/profile", userData);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Logout user
 * @returns {Promise} Response containing success status
 */
export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// Add token to requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token on 401 response
      setAuthToken(null);
    }
    return Promise.reject(error);
  }
);

export default {
  login,
  verifyOTP,
  resendOTP,
  forgotPassword,
  verifyForgotOTP,
  resetPassword,
  getCurrentUser,
  updateProfile,
  logout,
  setAuthToken,
};
