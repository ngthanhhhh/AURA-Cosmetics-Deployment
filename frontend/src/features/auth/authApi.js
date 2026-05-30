import axiosClient from "../../api/axiosClient";

/**
 * Gửi yêu cầu đăng ký tài khoản khách hàng mới.
 *
 * @param {Object} data Thông tin đăng ký.
 * @returns {Promise<Object>} Kết quả đăng ký từ backend.
 */

export const registerApi = (data) => {
    return axiosClient.post("/auth/register", data);
};

/**
 * Gửi yêu cầu đăng nhập hệ thống.
 *
 * API được sử dụng cho cả khách hàng và quản trị viên.
 *
 * @param {Object} data Thông tin đăng nhập.
 * @returns {Promise<Object>} JWT token và thông tin tài khoản.
 */

export const loginApi = (data) => {
    return axiosClient.post("/auth/login", data);
};