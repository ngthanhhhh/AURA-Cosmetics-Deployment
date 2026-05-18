import axiosClient from "../../api/axiosClient";

/**
 * Gọi API lấy danh sách tài khoản admin.
 *
 * @param {Object} params Bộ lọc truy vấn.
 * @returns {Promise<Object>} Response danh sách admin dạng phân trang.
 */
export const getAdminAccountsApi = (params) =>
    axiosClient.get("/admin/accounts", { params });

/**
 * Gọi API tạo tài khoản admin mới.
 *
 * @param {Object} data Thông tin tài khoản admin.
 * @returns {Promise<Object>} Response tài khoản admin đã tạo.
 */
export const createAdminAccountApi = (data) => 
    axiosClient.post("/admin/accounts", data);

/**
 * Gọi API cập nhật thông tin tài khoản admin.
 *
 * @param {number} id ID tài khoản admin.
 * @param {Object} data Thông tin cần cập nhật.
 * @returns {Promise<Object>} Response tài khoản admin sau cập nhật.
 */
export const updateAdminAccountApi = (id, data) =>
    axiosClient.put(`/admin/accounts/${id}`, data);

/**
 * Gọi API vô hiệu hóa tài khoản admin.
 *
 * Backend thực hiện khóa mềm bằng isActive = false.
 *
 * @param {number} id ID tài khoản admin.
 * @returns {Promise<Object>} Response thông báo từ backend.
 */
export const deleteAdminAccountApi = (id) =>
    axiosClient.delete(`/admin/accounts/${id}`);

/**
 * Gọi API đổi mật khẩu tài khoản admin.
 *
 * @param {number} id ID tài khoản admin.
 * @param {Object} data Dữ liệu đổi mật khẩu.
 * @returns {Promise<Object>} Response thông báo từ backend.
 */
export const changeAdminPasswordApi = (id, data) => 
    axiosClient.put(`/admin/accounts/${id}/password`, data);