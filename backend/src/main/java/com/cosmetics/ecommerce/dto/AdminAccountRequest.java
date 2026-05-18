package com.cosmetics.ecommerce.dto;

import lombok.Data;
/**
 * DTO nhận dữ liệu thêm hoặc cập nhật tài khoản admin.
 *
 * Khi tạo mới, password là bắt buộc.
 * Khi cập nhật, password không được xử lý tại API này.
 */
@Data
public class AdminAccountRequest {
    private String name;
    private String email;
    private String password;
    private Boolean isActive;
}
