import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7263/api",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return config;
});

export default api;
