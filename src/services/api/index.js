export { authAPI } from "./auth";
export { customerAPI } from "./customers";
export { orderAPI } from "./orders";

// Re-export base URL and axios instance for direct access if needed
export { BASE_URL, default as axiosInstance } from "../../config/axios";
