import axiosClient from "../../api/axiosClient";

// USER - TÀI KHOẢN ĐANG ĐĂNG NHẬP
export const getMyProfileApi = () => {
    return axiosClient.get("/users/me");
};

export const updateMyProfileApi = (data) => {
    return axiosClient.put("/users/me", data);
};

export const changePasswordApi = (data) => {
    return axiosClient.put("/users/change-password", data);
};

// ADMIN - QUẢN LÝ KHÁCH HÀNG

export const getCustomersApi = (params) => {
    return axiosClient.get("/admin/customers", {params,});
};

export const getCustomersDetailApi = (id) => {
    return axiosClient.get(`/admin/customers/${id}`);
};

export const updateCustomersStatusApi = (id, isActive) => {
    return axiosClient.put(`/admin/customers/${id}/status`, {isActive});
};

