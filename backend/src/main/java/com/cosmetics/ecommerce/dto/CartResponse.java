package com.cosmetics.ecommerce.dto;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartResponse {
    private List<CartItemDetailDTO> items;

    @NotNull(message = "Tổng tiền không được để trống")
    @Min(value = 0, message = "Tổng tiền phải lớn hơn hoặc bằng 0")
    private BigDecimal totalCartPrice;

    @Data
    public static class CartItemDetailDTO {
        private Integer productId;
        private String productName;
        private String productImage;

        @Min(value = 0, message = "Đơn giá không được âm")
        private BigDecimal unitPrice;

        @Min(value = 1, message = "Số lượng ít nhất là 1")
        private Integer quantity;

        private BigDecimal subTotal; // subTotal = unitPrice * quantity
    }
}
