package com.cosmetics.ecommerce.controller;

import com.cosmetics.ecommerce.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    //API lấy dữ liệu tổng hợp cho Dashboard của Admin
    //Endpoint: GET /api/admin/statistics/dashboard

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData(){
        return ResponseEntity.ok(statisticsService.getAdminDashboard());
    }

}
