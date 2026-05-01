import { registerApi } from "./authApi.js";

export const handleRegister = async (data) => {
    
    const res = await registerApi(data);
    return res.data; //Trả về thông báo thành công
    
};