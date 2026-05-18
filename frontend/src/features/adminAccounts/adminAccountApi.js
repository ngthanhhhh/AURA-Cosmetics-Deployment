import axiosClient from "../../api/axiosClient";

export const getAdminAccountsApi = (params) =>
    axiosClient.get("/admin/accounts", { params });

export const createAdminAccountApi = (data) => 
    axiosClient.post("/admin/accounts", data);

export const updateAdminAccountApi = (id, data) =>
    axiosClient.put(`/admin/accounts/${id}`, data);

export const deleteAdminAccountApi = (id) =>
    axiosClient.delete(`/admin/accounts/${id}`);

export const changeAdminPasswordApi = (id, data) => 
    axiosClient.put(`/admin/accounts/${id}/password`, data);