import axios from "axios";

/**
 * Centralized Axios instance.
 * Adjust baseURL to match your API origin.
 */
const api = axios.create({
  baseURL: "https://localhost:7263/api",
  withCredentials: false,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return config;
});

export default api;
