package com.cosmetics.ecommerce.service.impl;

import com.cosmetics.ecommerce.dto.RevenueChartDTO;
import com.cosmetics.ecommerce.dto.StatisticsResponse;
import com.cosmetics.ecommerce.repository.OrderRepository;
import com.cosmetics.ecommerce.repository.UserRepository;
import com.cosmetics.ecommerce.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor

public class StatisticsServiceImpl implements StatisticsService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Override
    //Lấy tổng hợp các thông số thống kê chính cho Dashboard của Admin
    public StatisticsResponse getAdminDashboard(){

        //Lấy doanh thu (Chỉ tính đơn COMPLETED)
        Double totalRevenue = orderRepository.calculateTotalRevenue();
        return StatisticsResponse.builder()
                .totalRevenue( totalRevenue != null ? totalRevenue : 0.0)
                .totalOrders( orderRepository.countTotalOrders())
                .totalUsers( userRepository.count())
                .pendingOrders( orderRepository.countByStatus("PENDING"))
                .shippingOrders( orderRepository.countByStatus("SHIPPING"))
                .completedOrders(orderRepository.countByStatus("COMPLETED"))
                .cancelledOrders( orderRepository.countByStatus("CANCELLED"))
                .build();

    }

    @Override
    public List<RevenueChartDTO> getRevenueChartData(String type, Integer month, Integer year){
        //Nếu admin không chọn, mặc định lấy năm/tháng hiện tại
        int targetYear = (year == null) ? LocalDate.now().getYear() : year;
        int targetMonth = (month == null) ? LocalDate.now().getMonthValue() : month;

        //Tách logic gọi Repository theo loại thống kê
        if ("day".equalsIgnoreCase(type)){
            return orderRepository.getRevenueByDay(targetMonth, targetYear);
        }

        // Mặc định trả về thống kê theo tháng trong năm
        return orderRepository.getRevenueByMonth(targetYear);
    }

}
