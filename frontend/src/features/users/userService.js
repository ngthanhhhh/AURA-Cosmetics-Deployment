import { 
    changePasswordApi, 
    getCustomersApi, 
    getCustomersDetailApi, 
    updateCustomersStatusApi,
    getMyProfileApi,
    updateMyProfileApi,
} from "./userApi";

// USER - TÀI KHOẢN ĐANG ĐĂNG NHẬP

export const fetchMyProfile = async () => {
    const res = await getMyProfileApi();
    return res.data;
};

export const updateMyProfile = async (data) => {
    const res = await updateMyProfileApi(data);
    return res.data;
};

export const changePassword = async (data) => {
    const res = await changePasswordApi(data);
    return res.data;
};

// ADMIN - QUẢN LÝ KHÁCH HÀNG
export const fetchCustomers = async (params) => {
    const res = await getCustomersApi(params);
    return res.data;
};

export const fetchCustomersDetail = async (id) => {
    const res = await getCustomersDetailApi(id);
    return res.data;
};

export const updateCustomersStatus = async (id, isActive) => {
    const res = await updateCustomersStatusApi(id, isActive);
    return res.data;
};
