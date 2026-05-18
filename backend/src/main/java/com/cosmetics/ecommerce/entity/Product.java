package com.cosmetics.ecommerce.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.cosmetics.ecommerce.enums.ProductStatus;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Entity
@Table(name = "products")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 150, message = "Tên không quá 150 ký tự")
    private String name;

    @NotNull(message = "Giá không được null")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá phải > 0")
    private BigDecimal price;

    @NotNull(message = "Stock không được null")
    @Min(value = 0, message = "Stock phải >= 0")
    private Integer stock = 0;

    @Size(max = 1000, message = "Mô tả không quá 1000 ký tự")
    private String description;

    @Size(max = 255, message = "URL ảnh không quá 255 ký tự")
    private String image;

    @Enumerated(EnumType.STRING)
    private ProductStatus status = ProductStatus.ACTIVE;

    @NotNull(message = "Category không được null")
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (name != null) name = name.trim();
        if (status == null) status = ProductStatus.ACTIVE;
        createdAt = updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        if (name != null) name = name.trim();
        updatedAt = LocalDateTime.now();
    }
}