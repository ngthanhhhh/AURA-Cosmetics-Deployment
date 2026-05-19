package com.cosmetics.ecommerce.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

/*
    DTO dùng cho Dashboard tổng quan của Admin
    Bao gồm:
    - Tổng doanh thu
    - Tổng số đơn hàng
    - Tổng khách hàng
    - Số lượng đơn theo từng trạng thái
 */

@Data
@Builder

public class StatisticsResponse {

    // Tổng doanh thu của toàn hệ thống
    // Chỉ tính các đơn COMPLETED
    private BigDecimal totalRevenue;

    // Tổng tất cả đơn hàng
    private Long totalOrders;

    // Tổng số khách hàng (ROLE_CUSTOMER)
    private Long totalUsers;

    // Thống kê số lượng đơn theo trạng thái
    private Long pendingOrders;
    private Long preparingOrders;
    private Long shippingOrders;
    private Long deliveredOrders;
    private Long completedOrders;
    private Long cancelledOrders;
}
