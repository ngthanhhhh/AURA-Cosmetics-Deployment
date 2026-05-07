package com.cosmetics.ecommerce.dto;

import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@NoArgsConstructor
public class RevenueChartDTO {
    private Object label; //Nhãn (Ngày 1, 2,... hoặc Tháng 1, 2, ...)
    private Double revenue; //Doanh thu

    public RevenueChartDTO(Object label, Double revenue){
        this.label = label;
        this.revenue = (revenue != null) ? revenue : 0.0;
    }
}
