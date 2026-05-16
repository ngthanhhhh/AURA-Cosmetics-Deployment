package com.cosmetics.ecommerce.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/*
    DTO dùng để hiển thị dữ liệu biểu đồ doanh thu
    Ví dụ:
    label = "01/05/2025"
    revenue = 250000
 */

@Data
@NoArgsConstructor
public class RevenueChartDTO {

    // Nhãn hiển thị trên biển đồ
    // Có thể là:
    // - ngày
    // - tuần
    // - tháng
    private String label;

    // Doanh thu tương ứng
    private Double revenue;

    public RevenueChartDTO(Object label, Number revenue) {

        this.label = (label != null) ? label.toString() : "";

        this.revenue = (revenue != null) ? revenue.doubleValue() : 0.0;
    }
}