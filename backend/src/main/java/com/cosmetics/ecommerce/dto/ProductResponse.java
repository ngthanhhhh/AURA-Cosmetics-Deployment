package com.cosmetics.ecommerce.dto;

import java.math.BigDecimal;

import lombok.Data;

//Dành cho khách xem
@Data
public class ProductResponse {
    private Integer productId;
    private String name;
    private BigDecimal price;
    private Integer stock;
    private String description;
    private String image;
    private String categoryName; // Hiện tên
    private String status;
    private Double averageRating;
    private Long reviewCount;
}
