import { registerApi } from "./authApi";

export const registerUser = async (data) => {
    const res = await registerApi(data);
    return res.data;
};