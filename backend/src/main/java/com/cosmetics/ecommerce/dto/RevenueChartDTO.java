package com.cosmetics.ecommerce.dto;

import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@NoArgsConstructor
public class RevenueChartDTO {
    private Integer label; //Nhãn (Ngày 1, 2,... hoặc Tháng 1, 2, ...)
    private Double revenue; //Doanh thu

    public RevenueChartDTO(Integer label, Double revenue){
        this.label = label;
        this.revenue = (revenue != null) ? revenue : 0.0;
    }
}
