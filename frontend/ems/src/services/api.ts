import axios from "axios";
import router from "@/router";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// ✅ แนบ token ทุก request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//ดัก response ถ้า token หมดอายุ
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token expired → auto logout");

      // ลบ token
      localStorage.removeItem("token");

      // เด้งไปหน้า login
      router.push("/login");
    }

    return Promise.reject(error);
  }
);

export default api;
