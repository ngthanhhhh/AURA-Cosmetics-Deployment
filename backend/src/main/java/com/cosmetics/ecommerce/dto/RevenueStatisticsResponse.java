package com.cosmetics.ecommerce.dto;

import com.cosmetics.ecommerce.enums.StatisticType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
    DTO dùng cho chức năng thống kê doanh thu
    Bao gồm:
    - khoảng thời gian thống kê
    - tổng doanh thu trong kỳ
    - số đơn hoàn thành
    - dữ liệu biểu đồ
 */

@Data
@Builder

public class RevenueStatisticsResponse {

    // Loại thống kê
    // DAY / WEEK / MONTH
    private StatisticType type;

    // Ngày bắt đầu
    private LocalDate fromDate;

    // Ngày kết thúc
    private LocalDate toDate;

    // Tổng doanh thu trong khoảng thời gian
    private BigDecimal totalRevenue;

    // Tổng số đơn COMPLETED
    private Long completedOrders;

    // Dữ liệu biểu đồ
    private List<RevenueChartDTO> chartData;
}
