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

/**
 * Xử lý token hết hạn hoặc không hợp lệ.
 *
 * Khi backend trả về 401:
 * - Xóa thông tin đăng nhập localStorage
 * - Điều hướng về trang login phù hợp
 */

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401){
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        localStorage.removeItem("user");

        const currentPath = window.location.pathname;

        if(currentPath.startsWith("/admin")){
          window.location.href = "/admin/login";
        } else {
          window.location.href = "/auth/login";
        }
      }

      return Promise.reject(error);
    }
);

export default axiosClient;