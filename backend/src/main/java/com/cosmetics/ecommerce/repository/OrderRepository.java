package com.cosmetics.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import com.cosmetics.ecommerce.entity.Order;
import com.cosmetics.ecommerce.entity.User;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer>{

    //Lấy danh sách đơn hàng của một người dùng
    List<Order> findByUserOrderByCreatedAtDesc(User user);

    //Tính tổng doanh thu từ các đơn hàng đã giao hàng thành công (DELIVERED)
    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.status = 'DELIVERED'")
    Double calculateTotalRevenue();

    //Đếm tổng số đơn hàng strong hệ thống
    @Query("SELECT COUNT(o) FROM Order o")
    Long countTotalOrders();

    //Đếm số đơn hàng theo trạng thái (ví dụ: PENDING, DELIVERD, CANCELLED)
    //giúp admin biết có bao nhiêu đơn đang xử lý
    Long countByStatus(String status);

}