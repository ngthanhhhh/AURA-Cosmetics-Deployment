package com.cosmetics.ecommerce.service;

import com.cosmetics.ecommerce.dto.RevenueStatisticsResponse;
import com.cosmetics.ecommerce.dto.StatisticsResponse;
import com.cosmetics.ecommerce.enums.StatisticType;

import java.time.LocalDate;

/*
    Service xử lý logic thống kê
 */

public interface StatisticsService{

    // Dashboard tổng quan
    StatisticsResponse getAdminDashboard();

    // Thống kê doanh thu theo
    // - ngày
    // - tuần
    // - tháng
    RevenueStatisticsResponse getRevenueStatistics(
            StatisticType type,
            LocalDate fromDate,
            LocalDate toDate);
}
