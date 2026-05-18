package com.cosmetics.ecommerce.dto;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
/**
 * DTO trả về thông tin chi tiết khách hàng
 * và lịch sử đơn hàng của khách hàng.
 */
public record CustomerDetailResponse(
        Integer id,
        String name,
        String email,
        String phone,
        String address,
        LocalDateTime createdAt,
        Boolean isActive,
        List<OrderHistoryDTO> orderHistory
) {
    /**
     * DTO mô tả một đơn hàng trong lịch sử mua hàng của khách hàng.
     */
    public record OrderHistoryDTO(
            Integer orderId,
            LocalDateTime createdAt,
            BigDecimal totalPrice,
            String status
    ){}
}
