package com.cosmetics.ecommerce.controller;

import com.cosmetics.ecommerce.dto.RevenueChartDTO;
import com.cosmetics.ecommerce.dto.StatisticsResponse;
import com.cosmetics.ecommerce.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    //API lấy dữ liệu tổng hợp cho Dashboard của Admin
    //Endpoint: GET /api/v1/admin/statistics/dashboard

    @GetMapping("/dashboard")
    public ResponseEntity<StatisticsResponse> getDashboardData(){
        return ResponseEntity.ok(statisticsService.getAdminDashboard());
    }

    //API phục vụ vẽ biểu đồ doanh thu theo Ngày/Tháng
    @GetMapping("/revenue")
    public ResponseEntity<List<RevenueChartDTO>> getRevenueChart(
            @RequestParam(defaultValue = "month") String type,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year){
        return ResponseEntity.ok(statisticsService.getRevenueChartData(type, month, year));
    }


}
