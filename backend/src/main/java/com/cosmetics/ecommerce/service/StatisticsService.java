package com.cosmetics.ecommerce.service;

import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.repository.OrderRepository;
import com.cosmetics.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    //Lấy tổng hợp các thông số thống kê chính cho Dashboard của Admin
    public Map<String, Object> getAdminDashboard(){
        Map<String, Object> stats = new HashMap<>();

        //1. Tính tổng doanh thu (Xử lý null để tránh lỗi Frontend)
        Double totalRevenue = orderRepository.calculateTotalRevenue();
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);

        //2. Đếm tổng số đơn hàng
        stats.put("totalOrders", orderRepository.countTotalOrders());

        //3. Đếm tổng số khách hàng trong hệ thống
        stats.put("totalUsers", userRepository.count());

        //4. thống kê chi tiết số lượng theo từng trạng thái đơn hàng
        stats.put("pendingOrders", orderRepository.countByStatus("PENDING"));
        stats.put("deliveredOrders", orderRepository.countByStatus("DELIVERED"));
        stats.put("cancelledOrders", orderRepository.countByStatus("CANCELLED"));

        return stats;
    }
}
