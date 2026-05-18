package com.cosmetics.ecommerce.dto;

import java.time.LocalDateTime;
/**
 * DTO trả về thông tin khách hàng trong danh sách quản lý khách hàng.
 * Không trả về password hoặc role nội bộ.
 */
public record CustomerResponse (
    Integer id,
    String name,
    String email,
    String phone,
    LocalDateTime createdAt,
    Boolean isActive
){}
