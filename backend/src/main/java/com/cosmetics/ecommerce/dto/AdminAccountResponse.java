package com.cosmetics.ecommerce.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
/**
 * DTO trả về thông tin tài khoản admin.
 *
 * Không trả về password để đảm bảo an toàn dữ liệu.
 */
@Data
@Builder

public class AdminAccountResponse {
    private Integer userId;
    private String name;
    private String email;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
