package com.cosmetics.ecommerce.dto;

import lombok.Builder;
import lombok.Data;

/**
 * DTO trả về thông tin profile cá nhân của user đang đăng nhập.
 *
 * Không trả về các thông tin nhạy cảm như password hoặc role nội bộ.
 */
@Data
@Builder
public class UserProfileResponse {
    private String name;
    private String email;
    private String phone;
    private String address;
}
