package com.cosmetics.ecommerce.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class RevenueResponse {
    private String period; // Ngày/Tháng
    private BigDecimal totalRevenue;
}
