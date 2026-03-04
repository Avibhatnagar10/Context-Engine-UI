import axios from "axios";

const api = axios.create({
  baseURL: "https://quiana-sulphuric-overenthusiastically.ngrok-free.dev",
  withCredentials: true, // send cookies
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export default api;