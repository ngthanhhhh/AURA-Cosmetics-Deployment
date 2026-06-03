import { 
    changePasswordApi, 
    getCustomersApi, 
    getCustomersDetailApi, 
    updateCustomersStatusApi,
    getMyProfileApi,
    updateMyProfileApi,
} from "./userApi";

/**
 * Lấy thông tin tài khoản của người dùng hiện tại.
 *
 * @returns {Promise<Object>} Thông tin profile người dùng.
 */

export const fetchMyProfile = async () => {
    const res = await getMyProfileApi();
    return res.data;
};

/**
 * Cập nhật thông tin cá nhân của người dùng hiện tại.
 *
 * @param {Object} data Dữ liệu profile cần cập nhật.
 * @returns {Promise<Object>} Kết quả cập nhật từ backend.
 */
export const updateMyProfile = async (data) => {
    const res = await updateMyProfileApi(data);
    return res.data;
};

/**
 * Đổi mật khẩu của người dùng hiện tại.
 *
 * @param {Object} data Dữ liệu đổi mật khẩu.
 * @returns {Promise<Object>} Kết quả đổi mật khẩu.
 */
export const changePassword = async (data) => {
    const res = await changePasswordApi(data);
    return res.data;
};

/**
 * Lấy danh sách khách hàng cho quản trị viên.
 *
 * @param {Object} params Bộ lọc, phân trang và sắp xếp.
 * @returns {Promise<Object>} Danh sách khách hàng.
 */
export const fetchCustomers = async (params) => {
    const res = await getCustomersApi(params);
    return res.data;
};
/**
 * Lấy chi tiết khách hàng theo ID.
 *
 * @param {number|string} id ID khách hàng.
 */
export const fetchCustomersDetail = async (id) => {
    const res = await getCustomersDetailApi(id);
    return res.data;
};
/**
 * Khóa hoặc mở khóa tài khoản khách hàng.
 *
 * @param {number|string} id ID khách hàng.
 * @param {boolean} isActive Trạng thái mới của tài khoản.
 */
export const updateCustomersStatus = async (id, isActive) => {
    const res = await updateCustomersStatusApi(id, isActive);
    return res.data;
};
