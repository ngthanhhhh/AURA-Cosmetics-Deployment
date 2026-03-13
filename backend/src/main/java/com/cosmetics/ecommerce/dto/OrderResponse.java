package com.cosmetics.ecommerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class OrderResponse {
    private Integer orderId;
    private LocalDateTime createdAt;
    private String status;
    private BigDecimal totalPrice;
    private List<OrderItemDTO> items;

    @Data
    public static class OrderItemDTO {
        private String productName;
        private Integer quantity;
        private BigDecimal price;
    }
}
