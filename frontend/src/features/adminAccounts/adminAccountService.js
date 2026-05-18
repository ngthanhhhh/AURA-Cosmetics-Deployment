import {
    getAdminAccountsApi,
    createAdminAccountApi,
    updateAdminAccountApi,
    deleteAdminAccountApi,
    changeAdminPasswordApi,
} from "./adminAccountApi";


/**
 * Lấy danh sách tài khoản admin.
 *
 * @param {Object} params Bộ lọc truy vấn.
 * @returns {Promise<Object>} Dữ liệu phân trang từ backend.
 */
export const fetchAdminAccounts = async (params) => {
    const res = await getAdminAccountsApi(params);
    return res.data; //Trả về cả page object
};

/**
 * Tạo tài khoản admin mới.
 *
 * @param {Object} data Thông tin tài khoản admin.
 * @returns {Promise<Object>} Tài khoản admin đã tạo.
 */
export const createAdminAccount = async (data) => {
    const res = await createAdminAccountApi(data);
    return res.data;
};

/**
 * Cập nhật thông tin tài khoản admin.
 *
 * @param {number} id ID tài khoản admin.
 * @param {Object} data Thông tin cần cập nhật.
 * @returns {Promise<Object>} Tài khoản admin sau cập nhật.
 */
export const updateAdminAccount = async (id, data) => {
    const res = await updateAdminAccountApi(id, data);
    return res.data;
};

/**
 * Vô hiệu hóa tài khoản admin.
 *
 * @param {number} id ID tài khoản admin.
 * @returns {Promise<Object>} Thông báo từ backend.
 */
export const deleteAdminAccount = async (id) => {
    const res = await deleteAdminAccountApi(id);
    return res.data;
};

/**
 * Đổi mật khẩu tài khoản admin.
 *
 * @param {number} id ID tài khoản admin.
 * @param {Object} data Dữ liệu đổi mật khẩu.
 * @returns {Promise<Object>} Thông báo từ backend.
 */
export const changeAdminPassword = async(id, data) => {
    const res = await changeAdminPasswordApi(id, data);
    return res.data;
};