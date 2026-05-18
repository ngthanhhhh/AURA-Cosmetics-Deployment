package com.cosmetics.ecommerce.repository;
import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.cosmetics.ecommerce.entity.Order;
import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.enums.OrderStatus;
import com.cosmetics.ecommerce.enums.PaymentMethod;
import com.cosmetics.ecommerce.enums.PaymentStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer>{
    List<Order> findByUser_UserIdOrderByCreatedAtDesc(Integer userId);

    @Query("""
            SELECT o
            FROM Order o
            WHERE o.user.userId = :userId
            AND (:status IS NULL OR o.status = :status)
            AND (
                :keyword IS NULL
                OR LOWER(o.recipientName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(o.recipientPhone) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(o.shippingAddress) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
            """)
    Page<Order> searchMyOrders(
        @Param("userId") Integer userId,
        @Param("status") OrderStatus status,
        @Param("keyword") String keyword,
        Pageable pageable
    );

    //Tìm kiếm theo tên/sđt; lọc theo trạng thái
    @Query("""
            SELECT o
            FROM Order o
            LEFT JOIN Payment p ON p.order = o
            LEFT JOIN o.user u
            WHERE (:status IS NULL OR o.status = :status)
            AND (:paymentMethod IS NULL OR p.paymentMethod = :paymentMethod)
            AND (:paymentStatus IS NULL OR p.status = :paymentStatus)
            AND (
                :keyword IS NULL
                OR LOWER(o.recipientName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(o.recipientPhone) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(o.shippingAddress) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
            """)
    Page<Order> searchAdminOrders(
        @Param("status") OrderStatus status,
        @Param("keyword") String keyword,
        @Param("paymentMethod") PaymentMethod paymentMethod,
        @Param("paymentStatus") PaymentStatus paymentStatus,
        Pageable pageable);

    //Lấy danh sách đơn hàng của một người dùng
    List<Order> findByUserOrderByCreatedAtDesc(User user);

    //Lấy danh sách đơn hàng theo UserId để phục vụ CustomerService
    List<Order> findByUserUserId(Integer userId);

}