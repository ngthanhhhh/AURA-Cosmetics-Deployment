import {
    getDashboardStatisticApi,
    getRevenueStatisticsApi,
} from "./statisticApi";

// DASHBOARD

export const fetchDashboardStatistics = async () => {
    const res = await getDashboardStatisticApi();
    return res.data;
};

// REVENUE STATISTICS

export const fetchRevenueStatistics = async (params) => {
    const res = await getRevenueStatisticsApi(params);
    return res.data;
};