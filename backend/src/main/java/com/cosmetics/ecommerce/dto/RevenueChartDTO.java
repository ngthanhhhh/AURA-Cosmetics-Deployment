package com.cosmetics.ecommerce.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO dùng để hiển thị một điểm dữ liệu trên biểu đồ doanh thu.
 *
 * Ví dụ:
 * label = "01/05/2026"
 * revenue = 250000
 */

@Data
@NoArgsConstructor
public class RevenueChartDTO {

    // Nhãn hiển thị trên biểu đồ
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