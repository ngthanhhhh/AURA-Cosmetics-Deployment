import { loginApi, registerApi } from "./authApi";

export const registerUser = async (data) => {
    const res = await registerApi(data);
    return res.data;
};

export const loginUser = async (data) => {
    const res = await loginApi(data);

    const { token, role, name } = res.data;

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
        })
    );

    return res.data;
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("user");
};