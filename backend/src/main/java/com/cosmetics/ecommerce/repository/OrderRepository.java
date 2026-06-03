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

/**
 * Repository thao tác với dữ liệu Order trong database.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Integer>{
    /**
     * Lấy danh sách đơn hàng của người dùng theo userId,
     * sắp xếp theo thời gian tạo mới nhất trước.
     *
     * @param userId ID người dùng
     * @return Danh sách đơn hàng của người dùng
     */
    List<Order> findByUser_UserIdOrderByCreatedAtDesc(Integer userId);

    /**
     * Tìm kiếm danh sách đơn hàng của một người dùng.
     *
     * Hỗ trợ:
     * - Lọc theo trạng thái đơn hàng
     * - Tìm kiếm theo tên người nhận, số điện thoại hoặc địa chỉ giao hàng
     * - Phân trang và sắp xếp thông qua Pageable
     *
     * @param userId   ID người dùng
     * @param status   Trạng thái đơn hàng cần lọc, có thể null
     * @param keyword  Từ khóa tìm kiếm, có thể null
     * @param pageable Thông tin phân trang và sắp xếp
     * @return Page chứa danh sách đơn hàng của người dùng
     */
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

    /**
     * Tìm kiếm danh sách đơn hàng dành cho Admin.
     *
     * Hỗ trợ:
     * - Lọc theo trạng thái đơn hàng
     * - Lọc theo phương thức thanh toán
     * - Lọc theo trạng thái thanh toán
     * - Tìm kiếm theo thông tin người nhận, địa chỉ, tên khách hàng hoặc email
     * - Phân trang và sắp xếp thông qua Pageable
     *
     * @param status        Trạng thái đơn hàng cần lọc, có thể null
     * @param keyword       Từ khóa tìm kiếm, có thể null
     * @param paymentMethod Phương thức thanh toán cần lọc, có thể null
     * @param paymentStatus Trạng thái thanh toán cần lọc, có thể null
     * @param pageable      Thông tin phân trang và sắp xếp
     * @return Page chứa danh sách đơn hàng dành cho Admin
     */
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

    /**
     * Lấy danh sách đơn hàng của một người dùng,
     * sắp xếp theo thời gian tạo mới nhất trước.
     *
     * @param user Người dùng cần lấy danh sách đơn hàng
     * @return Danh sách đơn hàng của người dùng
     */
    List<Order> findByUserOrderByCreatedAtDesc(User user);

    /**
     * Lấy danh sách đơn hàng theo userId.
     *
     * @param userId ID người dùng
     * @return Danh sách đơn hàng của người dùng
     */
    List<Order> findByUserUserId(Integer userId);

}