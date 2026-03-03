import axios from "axios";

const api = axios.create({
  baseURL: "https://quiana-sulphuric-overenthusiastically.ngrok-free.dev",
  withCredentials: true, // important if using cookies (refresh token)
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

// 🔐 Attach access token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 🚨 Handle expired token (basic version)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;