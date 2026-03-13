package com.cosmetics.ecommerce.dto;

import java.math.BigDecimal;

import lombok.Data;

//Dành cho Admin
@Data
public class ProductRequest {
    private String name;
    private BigDecimal price;
    private Integer stock;
    private String description;
    private String image;
    private Integer categoryId;
    private String status;
}
