import axiosClient from "../../api/axiosClient";

/**
 * Gọi API dashboard tổng quan admin.
 *
 * @returns {Promise<Object>} Dữ liệu dashboard tổng quan.
 */
export const getDashboardStatisticApi = () => {
    return axiosClient.get("/admin/statistics/dashboard");
};

/**
 * Gọi API thống kê doanh thu.
 *
 * Hỗ trợ:
 * - DAY
 * - WEEK
 * - MONTH
 * - custom range
 *
 * @param {Object} params Bộ lọc thống kê.
 * @returns {Promise<Object>} Dữ liệu thống kê doanh thu.
 */
export const getRevenueStatisticsApi = (params) => {
    return axiosClient.get("/admin/statistics/revenue", { params });
};
