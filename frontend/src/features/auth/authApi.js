import axiosClient from "../../api/axiosClient";

// Hàm gọi API đăng ký
export const registerApi = (userData) => {
    //userData sẽ là object chứa : name, email, password, phone, address...
    return axiosClient.post("/auth/register", userData);
}