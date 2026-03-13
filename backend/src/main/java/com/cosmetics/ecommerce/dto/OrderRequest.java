package com.cosmetics.ecommerce.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private String recipientName;
    private String recipientPhone;
    private String shippingAddress;
    private String paymentMethod;
}
