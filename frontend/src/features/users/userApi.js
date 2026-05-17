import axiosClient from "../../api/axiosClient";

/**
 * Gọi API lấy thông tin tài khoản đang đăng nhập.
 *
 * @returns {Promise<Object>} Response thông tin profile user.
 */
export const getMyProfileApi = () => {
    return axiosClient.get("/users/me");
};

/**
 * Gọi API cập nhật thông tin cá nhân.
 *
 * Cho phép cập nhật:
 * - họ tên
 * - số điện thoại
 * - địa chỉ
 *
 * @param {Object} data Dữ liệu profile cần cập nhật.
 * @returns {Promise<Object>} Response thông báo cập nhật.
 */
export const updateMyProfileApi = (data) => {
    return axiosClient.put("/users/me", data);
};

/**
 * Gọi API đổi mật khẩu tài khoản hiện tại.
 *
 * @param {Object} data Dữ liệu đổi mật khẩu.
 * @returns {Promise<Object>} Response thông báo đổi mật khẩu.
 */
export const changePasswordApi = (data) => {
    return axiosClient.put("/users/change-password", data);
};

/**
 * Gọi API lấy danh sách khách hàng.
 *
 * Hỗ trợ:
 * - phân trang
 * - tìm kiếm
 * - lọc trạng thái
 * - sắp xếp
 *
 * @param {Object} params Bộ lọc truy vấn.
 */

export const getCustomersApi = (params) => {
    return axiosClient.get("/admin/customers", {params,});
};

/**
 * Gọi API lấy chi tiết khách hàng.
 *
 * Bao gồm:
 * - thông tin cá nhân
 * - lịch sử đơn hàng
 *
 * @param {number} customerId ID khách hàng.
 * @returns {Promise<Object>} Response chi tiết khách hàng.
 */
export const getCustomersDetailApi = (id) => {
    return axiosClient.get(`/admin/customers/${id}`);
};

/**
 * Gọi API khóa hoặc mở khóa khách hàng.
 *
 * @param {number} customerId ID khách hàng.
 * @param {boolean} isActive Trạng thái mới.
 * @returns {Promise<Object>} Response thông báo cập nhật.
 */
export const updateCustomersStatusApi = (id, isActive) => {
    return axiosClient.put(`/admin/customers/${id}/status`, {isActive});
};

