package com.cosmetics.ecommerce.service;
import java.util.List;

import org.springframework.data.domain.Page;

import com.cosmetics.ecommerce.dto.OrderDetailResponseDTO;
import com.cosmetics.ecommerce.dto.OrderListDTO;
import com.cosmetics.ecommerce.dto.OrderRequestDTO;
import com.cosmetics.ecommerce.dto.OrderResponseDTO;

public interface OrderService {
    //checkout
    OrderResponseDTO placeOrder(Integer userId, OrderRequestDTO request);

    //xem lịch sử đơn hàng
    List<OrderResponseDTO> getMyOrders(Integer userId);

    //admin xem dsach don hang
    Page<OrderListDTO> getAdminOrders(String status, String keyword, int page, int size);

    //admin xem chi tiet 1 don hang
    OrderDetailResponseDTO getOrderDetailForAdmin(Integer orderId);
}
