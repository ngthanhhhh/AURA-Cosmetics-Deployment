package com.cosmetics.ecommerce.dto;

import java.math.BigDecimal;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartResponseDTO {
    private Integer cartId;
    private Integer userId;
    private List<CartItemResponseDTO> items;
    private BigDecimal totalCartValue;
}
