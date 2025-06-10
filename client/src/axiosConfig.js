// client/src/axiosConfig.js
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  console.warn("⚠️ VITE_API_URL no está definida. Revisa las variables de entorno en Netlify o .env");
}

const instance = axios.create({
  baseURL: baseURL || "http://localhost:10000/api", // fallback local
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
