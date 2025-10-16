import axios from "axios"; // just default import

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  token?: string;
}

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    // get the token from the localStorage:
    const token = localStorage.getItem("token");
    // If token is there attach it to the auth header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
