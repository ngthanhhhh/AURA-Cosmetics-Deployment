import { loginApi, registerApi } from "./authApi";

export const registerUser = async (data) => {
    const res = await registerApi(data);
    return res.data;
};

export const loginUser = async (data) => {
    const res = await loginApi(data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    return res.data;
};