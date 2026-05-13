package com.cosmetics.ecommerce.controller;

import com.cosmetics.ecommerce.dto.RevenueChartDTO;
import com.cosmetics.ecommerce.dto.RevenueStatisticsResponse;
import com.cosmetics.ecommerce.dto.StatisticsResponse;
import com.cosmetics.ecommerce.enums.StatisticType;
import com.cosmetics.ecommerce.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;


// Controller xử lý API thống kê cho Admin

@RestController
@RequestMapping("/api/v1/admin/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    // DASHBOARD TỔNG QUAN
    //Endpoint: GET /api/v1/admin/statistics/dashboard

    @GetMapping("/dashboard")
    public StatisticsResponse getDashboardData(){
        return statisticsService.getAdminDashboard();
    }

    // THỐNG KÊ DOANH THU
    // GET /api/v1/admin/statistics/revenue
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
