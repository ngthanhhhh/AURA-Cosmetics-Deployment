package com.cosmetics.ecommerce.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "categories")
@Data
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;

    @NotBlank(message = "Tên danh mục không được để trống")
    @Size(max = 100, message = "Tên không được vượt quá 100 ký tự")
    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Size(max = 500, message = "Mô tả không quá 500 ký tự")
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (name != null) name = name.trim();
        createdAt = updatedAt = LocalDateTime.now(); 
    }

    @PreUpdate
    public void preUpdate() {
        if (name != null) name = name.trim();
        updatedAt = LocalDateTime.now();
    }
}