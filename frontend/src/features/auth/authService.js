import { loginApi, registerApi } from "./authApi";

/**
 * Xử lý đăng ký tài khoản customer.
 *
 * @param {Object} data Dữ liệu đăng ký.
 * @returns {Promise<Object>} Dữ liệu trả về từ backend.
 */

export const registerUser = async (data) => {
    const res = await registerApi(data);
    return res.data;
};

/**
 * Xử lý đăng nhập hệ thống.
 *
 * Sau khi đăng nhập thành công:
 * - lưu JWT token
 * - lưu role
 * - lưu tên user
 * - lưu thông tin user vào localStorage
 *
 * @param {Object} data Thông tin đăng nhập.
 * @returns {Promise<Object>} Dữ liệu đăng nhập từ backend.
 */

export const loginUser = async (data) => {
    const res = await loginApi(data);

    const { token, role, name, email } = res.data;

    if (!token) {
        throw new Error("Đăng nhập thành công nhưng không nhận được token");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);
    localStorage.setItem(
        "user",
        JSON.stringify({
            name,
            role,
            email,
        })
    );

    return res.data;
};

/**
 * Đăng xuất người dùng hiện tại.
 *
 * Xóa toàn bộ thông tin đăng nhập khỏi localStorage.
 */

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("user");
};

