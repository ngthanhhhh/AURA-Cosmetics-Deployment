package com.cosmetics.ecommerce.service;

import com.cosmetics.ecommerce.dto.RevenueStatisticsResponse;
import com.cosmetics.ecommerce.dto.StatisticsResponse;
import com.cosmetics.ecommerce.enums.StatisticType;

import java.time.LocalDate;

/**
 * Service xử lý nghiệp vụ thống kê dành cho quản trị viên.
 *
 * Bao gồm:
 * - Dashboard tổng quan
 * - Thống kê doanh thu theo ngày
 * - Thống kê doanh thu theo tuần
 * - Thống kê doanh thu theo tháng
 */

public interface StatisticsService{

    /**
     * Lấy dữ liệu dashboard tổng quan của hệ thống.
     *
     * @return Thông tin thống kê tổng quan.
     */
    StatisticsResponse getAdminDashboard();

    /**
     * Thống kê doanh thu theo khoảng thời gian.
     *
     * @param type Loại thống kê: DAY, WEEK hoặc MONTH.
     * @param fromDate Ngày bắt đầu.
     * @param toDate Ngày kết thúc.
     * @return Dữ liệu doanh thu và biểu đồ.
     */
    RevenueStatisticsResponse getRevenueStatistics(
            StatisticType type,
            LocalDate fromDate,
            LocalDate toDate);
}
