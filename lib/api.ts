import axios from "axios";

const api = axios.create({
  baseURL: "https://quiana-sulphuric-overenthusiastically.ngrok-free.dev",
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export default api;