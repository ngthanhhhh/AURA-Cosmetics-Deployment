import axiosClient from "../../api/axiosClient";

export const changePasswordApi = (data) => {
    return axiosClient.put("/users/change-password", data);
};

// ADMIN - QUẢN LÝ KHÁCH HÀNG

export const getCustomersApi = (params) => {
    return axiosClient.get("/admin/customers", {params});
};

export const getCustomersDetailApi = (id) => {
    return axiosClient.get(`/admin/customers/${id}`);
};

export const updateCustomersStatusApi = (id, isActive) => {
    return axiosClient.put(`/admin/customers/${id}/status`, {isActive});
};