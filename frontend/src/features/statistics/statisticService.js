import {
    getDashboardStatisticApi,
    getRevenueStatisticsApi,
} from "./statisticApi";

/**
 * Lấy dữ liệu dashboard tổng quan.
 */

export const fetchDashboardStatistics = async () => {
    const res = await getDashboardStatisticApi();
    return res.data;
};

/**
 * Lấy dữ liệu thống kê doanh thu.
 *
 * @param {Object} params Bộ lọc thống kê.
 */

export const fetchRevenueStatistics = async (params) => {
    const res = await getRevenueStatisticsApi(params);
    return res.data;
};