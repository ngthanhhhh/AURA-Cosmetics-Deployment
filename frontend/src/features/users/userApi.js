import axiosClient from "../../api/axiosClient";

export const changePasswordApi = (data) => {
    return axiosClient.put("/users/change-password", data);
};

// ADMIN - QUẢN LÝ KHÁCH HÀNG
