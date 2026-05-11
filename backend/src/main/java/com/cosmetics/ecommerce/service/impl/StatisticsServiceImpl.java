package com.cosmetics.ecommerce.service.impl;

import com.cosmetics.ecommerce.dto.RevenueChartDTO;
import com.cosmetics.ecommerce.dto.StatisticsResponse;
import com.cosmetics.ecommerce.enums.OrderStatus;
import com.cosmetics.ecommerce.enums.StatisticType;
import com.cosmetics.ecommerce.exception.BadRequestException;
import com.cosmetics.ecommerce.repository.OrderRepository;
import com.cosmetics.ecommerce.repository.StatisticRepository;
import com.cosmetics.ecommerce.repository.UserRepository;
import com.cosmetics.ecommerce.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticsServiceImpl implements StatisticsService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final StatisticRepository statisticRepository;

    @Override
    public StatisticsResponse getAdminDashboard() {
        Double totalRevenue = orderRepository.calculateTotalRevenue();

        return StatisticsResponse.builder()
                .totalRevenue(totalRevenue == null ? 0.0 : totalRevenue)
                .totalOrders(orderRepository.countTotalOrders())
                .totalUsers(userRepository.count())
                .pendingOrders(orderRepository.countByStatus(OrderStatus.PENDING))
                .shippingOrders(orderRepository.countByStatus(OrderStatus.SHIPPING))
                .completedOrders(orderRepository.countByStatus(OrderStatus.COMPLETED))
                .cancelledOrders(orderRepository.countByStatus(OrderStatus.CANCELLED))
                .build();
    }

    @Override
    public List<RevenueChartDTO> getRevenueChartData(StatisticType type, LocalDate fromDate, LocalDate toDate) {

        if (type == null) {
            throw new BadRequestException("Vui lòng chọn loại thống kê");
        }

        LocalDateTime start = (fromDate != null)
                ? fromDate.atStartOfDay()
                : LocalDate.now().minusDays(30).atStartOfDay();

        LocalDateTime end = (toDate != null)
                ? toDate.atTime(23, 59, 59)
                : LocalDate.now().atTime(23, 59, 59);

        if (start.isAfter(end)) {
            throw new BadRequestException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        switch (type) {
            case DAY:
                return statisticRepository.getRevenueByDay(start, end);
            case WEEK:
                return statisticRepository.getRevenueByWeek(start, end);
            case MONTH:
                return statisticRepository.getRevenueByMonth(start, end);
            default:
                throw new BadRequestException("Loại thống kê không hợp lệ");
        }
    }
}