package com.cosmetics.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RevenueChartDTO {
    private Object label; //Nhãn (Ngày 1, 2,... hoặc Tháng 1, 2, ...)
    private Double revenue; //Doanh thu
}
