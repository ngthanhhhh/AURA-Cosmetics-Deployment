import axiosClient from "../../api/axiosClient";

/**
 * Gọi API đăng ký tài khoản khách hàng.
 *
 * @param {Object} data Thông tin đăng ký.
 * @returns {Promise<Object>} Response từ backend.
 */

export const registerApi = (data) => {
    return axiosClient.post("/auth/register", data);
};

/**
 * Gọi API đăng nhập hệ thống.
 *
 * API này dùng chung cho cả customer và admin.
 *
 * @param {Object} data Thông tin đăng nhập.
 * @returns {Promise<Object>} JWT token và thông tin user.
 */

export const loginApi = (data) => {
    return axiosClient.post("/auth/login", data);
};