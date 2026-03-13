package com.cosmetics.ecommerce.dto;

import lombok.Data;

@Data
public class CartItemRequest {
    private Integer productId;
    private Integer quantity;
}
