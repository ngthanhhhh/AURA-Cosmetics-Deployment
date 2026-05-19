package com.cosmetics.ecommerce.service.impl;

import com.cosmetics.ecommerce.dto.RevenueChartDTO;
import com.cosmetics.ecommerce.dto.RevenueStatisticsResponse;
import com.cosmetics.ecommerce.dto.StatisticsResponse;
import com.cosmetics.ecommerce.enums.OrderStatus;
import com.cosmetics.ecommerce.enums.StatisticType;
import com.cosmetics.ecommerce.exception.BadRequestException;
import com.cosmetics.ecommerce.repository.StatisticRepository;
import com.cosmetics.ecommerce.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Cài đặt nghiệp vụ thống kê dành cho quản trị viên.
 *
 * Bao gồm:
 * - Dashboard tổng quan toàn hệ thống
 * - Thống kê doanh thu theo ngày, tuần, tháng
 */
@Service
@RequiredArgsConstructor
public class StatisticsServiceImpl implements StatisticsService {

    private final StatisticRepository statisticRepository;

    // DASHBOARD TỔNG QUAN

    @Override
    public StatisticsResponse getAdminDashboard() {

        // Tổng doanh thu
        BigDecimal totalRevenue = statisticRepository.sumTotalRevenue();

        // Tổng khách hàng
        Long totalUsers = statisticRepository.countTotalUsers();

        // Đếm số lượng đơn hàng theo trạng thái
        Long pending = statisticRepository.countByOrderStatus(OrderStatus.PENDING);
        Long preparing = statisticRepository.countByOrderStatus(OrderStatus.PREPARING);
        Long shipping = statisticRepository.countByOrderStatus(OrderStatus.SHIPPING);
        Long delivered = statisticRepository.countByOrderStatus(OrderStatus.DELIVERED);
        Long completed = statisticRepository.countByOrderStatus(OrderStatus.COMPLETED);
        Long cancelled = statisticRepository.countByOrderStatus(OrderStatus.CANCELLED);

        // Tổng tất cả đơn
        Long totalOrders = pending + preparing + shipping + delivered + completed + cancelled;

        return StatisticsResponse.builder()

                // Nếu chưa có doanh thu -> trả về 0
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .totalOrders(totalOrders)
                .totalUsers(totalUsers != null ? totalUsers : 0L)
                .pendingOrders(pending)
                .preparingOrders(preparing)
                .shippingOrders(shipping)
                .deliveredOrders(delivered)
                .completedOrders(completed)
                .cancelledOrders(cancelled)
                .build();
    }

    // THỐNG KÊ DOANH THU

    @Override
    public RevenueStatisticsResponse getRevenueStatistics(
            StatisticType type,
            LocalDate fromDate,
            LocalDate toDate) {

        // Kiểm tra loại thống kê
        if (type == null) {
            throw new BadRequestException("Vui lòng chọn loại thống kê (Ngày, Tuần hoặc Tháng)");
        }

        // Thiết lập khoảng thời gian mặc định
        // DAY -> 30 ngày gần nhất
        // WEEK -> 12 tuần gần nhất
        // MONTH -> 12 tháng gần nhất

        LocalDate defaultFromDate = switch (type) {

            case DAY ->
                LocalDate.now().minusDays(30);

            case WEEK ->
                LocalDate.now().minusWeeks(12);

            case MONTH ->
                LocalDate.now().minusMonths(12);
        };

        LocalDate startDate = fromDate != null ? fromDate : defaultFromDate;

        LocalDate endDate = toDate != null ? toDate : LocalDate.now();

        // Validate ngày
        if (startDate.isAfter(endDate)) {
            throw new BadRequestException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        // Lấy dữ liệu biểu đồ
        List<RevenueChartDTO> chartData = switch (type) {
            case DAY -> statisticRepository.getRevenueByDay(startDate, endDate);
            case WEEK -> statisticRepository.getRevenueByWeek(startDate, endDate);
            case MONTH -> statisticRepository.getRevenueByMonth(startDate, endDate);
            default -> throw new BadRequestException("Loại thống kê không được hỗ trợ");
        };

        // Tổng doanh thu trong kỳ
        BigDecimal totalRevenue = statisticRepository.getRevenueBetween(startDate, endDate);

        // Tổng số đơn COMPLETED
        Long completedOrders = statisticRepository.countCompletedOrdersBetween(startDate, endDate);

        return RevenueStatisticsResponse.builder()
                .type(type)
                .fromDate(startDate)
                .toDate(endDate)
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .completedOrders(completedOrders != null ? completedOrders : 0L)
                .chartData(chartData != null ? chartData : List.of())
                .build();
    }
}