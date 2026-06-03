import { loginApi, registerApi } from "./authApi";

/**
 * Thực hiện đăng ký tài khoản khách hàng.
 *
 * @param {Object} data Thông tin đăng ký.
 * @returns {Promise<Object>} Dữ liệu trả về từ backend.
 */

export const registerUser = async (data) => {
    const res = await registerApi(data);
    return res.data;
};

/**
 * Thực hiện đăng nhập hệ thống.
 *
 * Sau khi xác thực thành công:
 * - lưu JWT token
 * - lưu thông tin người dùng
 * - lưu quyền hiện tại vào localStorage
 *
 * @param {Object} data Thông tin đăng nhập.
 * @returns {Promise<Object>} Thông tin người dùng và JWT token.
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
 * Xóa toàn bộ dữ liệu xác thực khỏi localStorage.
 */

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("user");
};

