import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// auto gắn token nếu có
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  const isAuthRequest =
    config.url?.startsWith("/auth/") ||
    config.url?.includes("/auth/");

  if (token && !isAuthRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;