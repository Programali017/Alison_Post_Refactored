// client/src/axiosConfig.js
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

if (!baseURL) {
  console.error("❌ REACT_APP_API_URL no está definida. Revisa Netlify.");
}

const instance = axios.create({
  baseURL: baseURL,
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
