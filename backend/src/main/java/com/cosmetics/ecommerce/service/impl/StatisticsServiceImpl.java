package com.cosmetics.ecommerce.service.impl;

import com.cosmetics.ecommerce.dto.RevenueChartDTO;
import com.cosmetics.ecommerce.dto.StatisticsResponse;
import com.cosmetics.ecommerce.enums.OrderStatus;
import com.cosmetics.ecommerce.enums.StatisticType;
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
                .totalRevenue( totalRevenue == null ? 0.0 : totalRevenue )
                .totalOrders( orderRepository.countTotalOrders())
                .totalUsers( userRepository.count())
                .pendingOrders( orderRepository.countByStatus(OrderStatus.PENDING))
                .shippingOrders( orderRepository.countByStatus(OrderStatus.SHIPPING))
                .completedOrders(orderRepository.countByStatus(OrderStatus.COMPLETED))
                .cancelledOrders( orderRepository.countByStatus(OrderStatus.CANCELLED))
                .build();

    }

    @Override
    public List<RevenueChartDTO> getRevenueChartData(StatisticType type, Integer month, Integer year, LocalDate fromDate, LocalDate toDate){

        if(type == null){
            throw new BadRequestException("Vui lòng chọn loại thống kê");
        }

        int targetYear = (year == null) ? LocalDate.now().getYear() : year;

        switch (type) {
            case DAY:
                // Nếu xem theo ngày mà không chọn tháng, mặc định lấy tháng hiện tại
                int targetMonth = (month == null) ? LocalDate.now().getMonthValue() : month;
                if (targetMonth < 1 || targetMonth > 12) {
                    throw new BadRequestException("Tháng không hợp lệ (1-12)");
                }
                return orderRepository.getRevenueByDay(targetMonth, targetYear);

            case MONTH:
                return orderRepository.getRevenueByMonth(targetYear);

            case RANGE:
                if (fromDate == null || toDate == null) {
                    throw new BadRequestException("Vui lòng nhập khoảng ngày");
                }

                if (fromDate.isAfter(toDate)) {
                    throw new BadRequestException("Ngày bắt đầu phải trước ngày kết thúc");
                }

                return orderRepository.getRevenueByDateRange(fromDate, toDate);
        }

        throw new BadRequestException("Loại thống kê không hợp lệ");
    }
}
