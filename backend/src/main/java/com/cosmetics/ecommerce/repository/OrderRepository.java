package com.cosmetics.ecommerce.repository;

import java.util.List;

import com.cosmetics.ecommerce.dto.RevenueChartDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import com.cosmetics.ecommerce.entity.Order;
import com.cosmetics.ecommerce.entity.User;
import org.springframework.data.repository.query.Param;


@Repository
public interface OrderRepository extends JpaRepository<Order, Integer>{

    //Lấy danh sách đơn hàng của một người dùng
    List<Order> findByUserOrderByCreatedAtDesc(User user);

    //Lấy danh sách đơn hàng theo UserId để phục vụ CustomerService
    List<Order> findByUserUserId(Integer userId);

    //Tính tổng doanh thu từ các đơn hàng đã giao hàng thành công (DELIVERED)
    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.status = 'COMPLETED'")
    Double calculateTotalRevenue();

    //Đếm tổng số đơn hàng strong hệ thống
    @Query("SELECT COUNT(o) FROM Order o")
    Long countTotalOrders();

    //Đếm số đơn hàng theo trạng thái (ví dụ: PENDING, DELIVERD, CANCELLED)
    //giúp admin biết có bao nhiêu đơn đang xử lý
    Long countByStatus(String status);

    //1. Thống kê theo ngày trong tháng (Dùng cho UC3.8 - Biểu đồ doanh thu tháng)
    @Query("SELECT new com.cosmetics.ecommerce.dto.RevenueChartDTO(DAY(o.createdAt), CAST(SUM(o.totalPrice) AS double)) " +
            "FROM Order o WHERE o.status = 'COMPLETED' " +
            "AND MONTH(o.createdAt) = :m AND YEAR(o.createdAt) = :y " +
            "GROUP BY DAY(o.createdAt) ORDER BY DAY(o.createdAt)")
    List<RevenueChartDTO> getRevenueByDay(@Param("m") int month, @Param("y") int year);

    //2. Thống kê theo tháng trong năm
    @Query("SELECT new com.cosmetics.ecommerce.dto.RevenueChartDTO(MONTH(o.createdAt), CAST(SUM(o.totalPrice) AS double)) " +
            "FROM Order o WHERE o.status = 'COMPLETED' AND YEAR(o.createdAt) = :y " +
            "GROUP BY MONTH(o.createdAt) ORDER BY MONTH(o.createdAt)")
    List<RevenueChartDTO> getRevenueByMonth(@Param("y") int year);

}