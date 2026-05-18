package com.cosmetics.ecommerce.controller;

import com.cosmetics.ecommerce.dto.RevenueStatisticsResponse;
import com.cosmetics.ecommerce.dto.StatisticsResponse;
import com.cosmetics.ecommerce.enums.StatisticType;
import com.cosmetics.ecommerce.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

/**
 * API thống kê dành cho quản trị viên.
 *
 * Bao gồm:
 * - Dashboard tổng quan
 * - Thống kê doanh thu theo ngày, tuần, tháng
 */

@RestController
@RequestMapping("/api/v1/admin/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    /**
     * Lấy dữ liệu dashboard tổng quan của admin.
     *
     * @return Thống kê tổng quan toàn hệ thống.
     */
    @GetMapping("/dashboard")
    public StatisticsResponse getDashboardData(){
        return statisticsService.getAdminDashboard();
    }

    /**
     * Lấy thống kê doanh thu theo ngày, tuần hoặc tháng.
     *
     * @param type Loại thống kê: DAY, WEEK hoặc MONTH.
     * @param fromDate Ngày bắt đầu, có thể bỏ trống.
     * @param toDate Ngày kết thúc, có thể bỏ trống.
     * @return Dữ liệu thống kê doanh thu và biểu đồ.
     */
    @GetMapping("/revenue")
    public RevenueStatisticsResponse getRevenueChart(
            @RequestParam StatisticType type,

            @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd")
            LocalDate fromDate,

            @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd")
            LocalDate toDate
    ){
        return statisticsService.getRevenueStatistics(type, fromDate, toDate);
    }


}
