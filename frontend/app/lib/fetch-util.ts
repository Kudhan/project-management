import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";

// Base URL from environment or fallback
const BASE_URL ="http://localhost:5000/api";

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        window.dispatchEvent(new Event("forceLogout"));
      } else if (status >= 500) {
        console.error("Server error:", error.message);
      }
    } else if (error.request) {
      console.error("No response from server:", error.message);
    } else {
      console.error("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);

// Generic POST method
const postData = async <T>(path: string, data: unknown): Promise<T> => {
  const response = await api.post<T>(path, data);
  return response.data;
};

// Generic GET method with optional query params
const fetchData = async <T>(path: string, params?: Record<string, any>): Promise<T> => {
  const config: AxiosRequestConfig = {};
  if (params) config.params = params;

  const response = await api.get<T>(path, config);
  return response.data;
};

// Generic PUT method
const updateData = async <T>(path: string, data: unknown): Promise<T> => {
  const response = await api.put<T>(path, data);
  return response.data;
};

// Generic DELETE method
const deleteData = async <T>(path: string): Promise<T> => {
  const response = await api.delete<T>(path);
  return response.data;
};

// Export all utility methods
export {
  postData,
  fetchData,
  updateData,
  deleteData
};
