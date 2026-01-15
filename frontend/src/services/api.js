import axios from "axios";

const API_ROOT = import.meta.env.VITE_API_URL || "/api/users";

const api = axios.create({
  baseURL: API_ROOT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: attach response interceptor to catch 401 and redirect / notify
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // you can expand error handling here
    return Promise.reject(err);
  }
);

export default api;
