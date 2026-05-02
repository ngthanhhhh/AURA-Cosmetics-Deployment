package com.cosmetics.ecommerce.service.impl;

import com.cosmetics.ecommerce.dto.RevenueChartDTO;
import com.cosmetics.ecommerce.dto.StatisticsResponse;
import com.cosmetics.ecommerce.enums.OrderStatus;
import com.cosmetics.ecommerce.exception.BadRequestException;
import com.cosmetics.ecommerce.repository.OrderRepository;
import com.cosmetics.ecommerce.repository.UserRepository;
import com.cosmetics.ecommerce.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

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
                .pendingOrders( orderRepository.countByStatus(OrderStatus.PENDING))
                .shippingOrders( orderRepository.countByStatus(OrderStatus.SHIPPING))
                .completedOrders(orderRepository.countByStatus(OrderStatus.COMPLETED))
                .cancelledOrders( orderRepository.countByStatus(OrderStatus.CANCELLED))
                .build();

    }

    @Override
    public List<RevenueChartDTO> getRevenueChartData(String type, Integer month, Integer year){
        if(type == null || type.trim().isEmpty()){
            throw new BadRequestException("Vui lòng chọn loại thống kê");
        }

        type = type.trim().toLowerCase();

        int targetYear = (year == null) ? LocalDate.now().getYear() : year;

        if("day".equals(type)){
            if(month == null){
                throw new BadRequestException("Vui lòng chọn tháng khi xem thống kê theo ngày");
            }
            if(month < 1 || month > 12){
                throw new BadRequestException("Tháng không hợp lệ (1–12)");
            }
            return orderRepository.getRevenueByDay(month, targetYear);
        }

        if("month".equals(type)){
            return orderRepository.getRevenueByMonth(targetYear);
        }

        throw new BadRequestException("Loại thống kê không hợp lệ");
    }

}
