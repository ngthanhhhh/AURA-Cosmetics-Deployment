import { changePasswordApi } from "./userApi";

export const changePassword = async (data) => {
    const res = await changePasswordApi(data);
    return res.data;
};