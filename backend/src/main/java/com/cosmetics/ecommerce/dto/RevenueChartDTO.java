package com.cosmetics.ecommerce.dto;

import lombok.NoArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class RevenueChartDTO {
    private Integer label; //Nhãn (Ngày 1, 2,... hoặc Tháng 1, 2, ...)
    private Double revenue; //Doanh thu

    public RevenueChartDTO(Integer label, BigDecimal revenue){
        this.label = (label != null) ? label : 0;
        this.revenue = (revenue != null) ? revenue.doubleValue() : 0.0;
    }
}
