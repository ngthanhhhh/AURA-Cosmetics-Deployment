package com.cosmetics.ecommerce.service;

import com.cosmetics.ecommerce.dto.RevenueChartDTO;
import com.cosmetics.ecommerce.dto.StatisticsResponse;
import com.cosmetics.ecommerce.enums.StatisticType;
import lombok.RequiredArgsConstructor;

import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;
import java.util.List;

public interface StatisticsService{
    //Chức năng 1: Lấy số liệu tổng quát cho các thẻ bài Dashboard
    StatisticsResponse getAdminDashboard();

    //Chức năng 2: Lấy dữ liệu danh sách để vẽ biểu đồ doanh thu
    List<RevenueChartDTO> getRevenueChartData(StatisticType type, Integer month, Integer year, LocalDate fromDate, LocalDate toDate);
}
