import {
    getAdminAccountsApi,
    createAdminAccountApi,
    updateAdminAccountApi,
    deleteAdminAccountApi,
    changeAdminPasswordApi,
} from "./adminAccountApi";

export const fetchAdminAccounts = async (params) => {
    const res = await getAdminAccountsApi(params);
    return res.data; //Trả về cả page object
};

export const createAdminAccount = async (data) => {
    const res = await createAdminAccountApi(data);
    return res.data;
};

export const updateAdminAccount = async (id, data) => {
    const res = await updateAdminAccountApi(id, data);
    return res.data;
};

export const deleteAdminAccount = async (id) => {
    const res = await deleteAdminAccountApi(id);
    return res.data;
};

export const changeAdminPassword = async(id, data) => {
    const res = await changeAdminPasswordApi(id, data);
    return res.data;
};