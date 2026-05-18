import axiosClient from "../../api/axiosClient";

// DASHBOARD TỔNG QUAN

export const getDashboardStatisticApi = () => {
    return axiosClient.get("/admin/statistics/dashboard");
};

// THỐNG KÊ DOANH THU

export const getRevenueStatisticsApi = (params) => {
    return axiosClient.get("/admin/statistics/revenue", { params, });
};
