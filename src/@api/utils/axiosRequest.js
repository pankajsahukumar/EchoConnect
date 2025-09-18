
import axios from "axios";

const axiosRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000", // Your API base URL
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor
axiosRequest.interceptors.request.use(
  (config) => {
    // Example: attach auth token from localStorage or cookies
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor
axiosRequest.interceptors.response.use(
  (response) => response.data, // unwrap response
  (error) => {
    // Handle common errors globally
    if (error.response?.status === 401) {
      console.error("Unauthorized, redirecting to login...");
      // e.g., redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosRequest;
