package com.cosmetics.ecommerce.repository;

import com.cosmetics.ecommerce.dto.RevenueChartDTO;
import com.cosmetics.ecommerce.entity.Order;
import com.cosmetics.ecommerce.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Repository dùng cho module thống kê.
 *
 * Bao gồm:
 * - Dashboard tổng quan
 * - Biểu đồ doanh thu
 * - Tổng hợp doanh thu theo khoảng thời gian
 */

@Repository
public interface StatisticRepository extends JpaRepository<Order, Integer> {

    // Các hàm vẽ biểu đồ

    // DAY - Thống kê doanh thu theo NGÀY

    @Query("""
                SELECT new com.cosmetics.ecommerce.dto.RevenueChartDTO(
                    FUNCTION('DATE_FORMAT',o.createdAt, '%d/%m/%Y'),
                    SUM(o.totalPrice)
                )
                FROM Order o
                WHERE o.status = com.cosmetics.ecommerce.enums.OrderStatus.COMPLETED
                AND FUNCTION('DATE', o.createdAt) BETWEEN :fromDate AND :toDate
                GROUP BY FUNCTION('DATE_FORMAT', o.createdAt, '%d/%m/%Y')
                ORDER BY MIN(o.createdAt)
            """)
    List<RevenueChartDTO> getRevenueByDay(
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);

    // WEEK - Thống kê doanh thu theo TUẦN

    @Query("""
                SELECT new com.cosmetics.ecommerce.dto.RevenueChartDTO(
                    FUNCTION('DATE_FORMAT', o.createdAt, '%Y-W%u'),
                    SUM(o.totalPrice)
                )
                FROM Order o
                WHERE o.status = com.cosmetics.ecommerce.enums.OrderStatus.COMPLETED
                AND FUNCTION('DATE', o.createdAt) BETWEEN :fromDate AND :toDate
                GROUP BY FUNCTION('DATE_FORMAT', o.createdAt, '%Y-W%u')
                ORDER BY MIN(o.createdAt)
            """)
    List<RevenueChartDTO> getRevenueByWeek(
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);

    // MONTH - Thống kê doanh thu theo THÁNG

    @Query("""
                SELECT new com.cosmetics.ecommerce.dto.RevenueChartDTO(
                    FUNCTION('DATE_FORMAT', o.createdAt, '%m/%Y'),
                    SUM(o.totalPrice)
                )
                FROM Order o
                WHERE o.status = com.cosmetics.ecommerce.enums.OrderStatus.COMPLETED
                AND FUNCTION('DATE', o.createdAt) BETWEEN :fromDate AND :toDate
                GROUP BY FUNCTION('DATE_FORMAT', o.createdAt, '%m/%Y')
                ORDER BY MIN(o.createdAt)
            """)
    List<RevenueChartDTO> getRevenueByMonth(
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);
    // DASHBOARD TỔNG QUAN

    // 1. Tính TỔNG DOANH THU toàn hệ thống
    // Chỉ tính đơn COMPLETED
    @Query("""
                SELECT COALESCE(SUM(o.totalPrice), 0)
                FROM Order o
                WHERE o.status = com.cosmetics.ecommerce.enums.OrderStatus.COMPLETED
            """)
    BigDecimal sumTotalRevenue();

    // 2. Đếm số lượng đơn hàng theo trạng thái
    @Query("""
                SELECT COUNT(o)
                FROM Order o
                WHERE o.status = :status
            """)
    Long countByOrderStatus(@Param("status") OrderStatus status);

    // 3. Đếm số lượng khách hàng (Chỉ ROLE_CUSTOMER)
    @Query("""
                SELECT COUNT(u)
                FROM User u
                WHERE u.role.roleName = 'ROLE_CUSTOMER'
            """)
    Long countTotalUsers();

    // THỐNG KÊ TỔNG HỢP TRONG KHOẢNG THỜI GIAN

    // Tính tổng doanh thu trong khoảng thời gian
    @Query("""
                SELECT COALESCE(SUM(o.totalPrice), 0)
                FROM Order o
                WHERE o.status = com.cosmetics.ecommerce.enums.OrderStatus.COMPLETED
                AND FUNCTION('DATE', o.createdAt) BETWEEN :fromDate AND :toDate
            """)
    BigDecimal getRevenueBetween(
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);

    // Đếm số lượng đơn COMPLETED trong khoảng thời gian
    @Query("""
                SELECT COUNT(o)
                FROM Order o
                WHERE o.status = com.cosmetics.ecommerce.enums.OrderStatus.COMPLETED
                AND FUNCTION('DATE', o.createdAt) BETWEEN :fromDate AND :toDate
            """)
    Long countCompletedOrdersBetween(
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);
}