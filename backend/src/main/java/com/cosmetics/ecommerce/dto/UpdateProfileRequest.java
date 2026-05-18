package com.cosmetics.ecommerce.dto;

import lombok.Data;

/**
 * DTO nhận dữ liệu cập nhật profile cá nhân.
 *
 * Frontend chỉ gửi các thông tin được phép chỉnh sửa,
 * không gửi userId, email, password hoặc role.
 */
@Data

public class UpdateProfileRequest {
    private String name;
    private String phone;
    private String address;
}
