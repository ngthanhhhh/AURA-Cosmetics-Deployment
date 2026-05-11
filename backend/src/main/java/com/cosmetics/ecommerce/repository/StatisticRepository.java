package com.cosmetics.ecommerce.repository;

import com.cosmetics.ecommerce.dto.RevenueChartDTO;
import com.cosmetics.ecommerce.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface StatisticRepository extends JpaRepository<Order, Integer> {

    // DAY - Doanh thu từng ngày trong khoảng thời gian
    @Query("""
        SELECT new com.cosmetics.ecommerce.dto.RevenueChartDTO(
            DAY(o.createdAt),
            SUM(o.totalPrice)
        )
        FROM Order o
        WHERE o.status = com.cosmetics.ecommerce.enums.OrderStatus.COMPLETED
        AND o.createdAt BETWEEN :from AND :to
        GROUP BY DAY(o.createdAt)
        ORDER BY DAY(o.createdAt)
    """)
    List<RevenueChartDTO> getRevenueByDay(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    // WEEK - Doanh thu từng tuần trong khoảng thời gian
    @Query("""
        SELECT new com.cosmetics.ecommerce.dto.RevenueChartDTO(
            FUNCTION("WEEK", o.createdAt),
            SUM(o.totalPrice)
        )
        FROM Order o
        WHERE o.status = com.cosmetics.ecommerce.enums.OrderStatus.COMPLETED
        AND o.createdAt BETWEEN :from AND :to
        GROUP BY FUNCTION("WEEK", o.createdAt)
        ORDER BY FUNCTION("WEEK", o.createdAt)
    """)
    List<RevenueChartDTO> getRevenueByWeek(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    // MONTH - Doanh thu từng tháng trong khoảng thời gian
    @Query("""
        SELECT new com.cosmetics.ecommerce.dto.RevenueChartDTO(
            MONTH(o.createdAt),
            SUM(o.totalPrice)
        )
        FROM Order o
        WHERE o.status = com.cosmetics.ecommerce.enums.OrderStatus.COMPLETED
        AND o.createdAt BETWEEN :from AND :to
        GROUP BY MONTH(o.createdAt)
        ORDER BY MONTH(o.createdAt)
    """)
    List<RevenueChartDTO> getRevenueByMonth(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}