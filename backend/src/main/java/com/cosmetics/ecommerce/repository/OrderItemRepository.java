package com.cosmetics.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cosmetics.ecommerce.entity.Order;
import com.cosmetics.ecommerce.entity.OrderItem;
import com.cosmetics.ecommerce.enums.OrderStatus;

/**
 * Repository thao tác với dữ liệu OrderItem trong database.
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer>{
    /**
     * Lấy danh sách chi tiết sản phẩm thuộc một đơn hàng.
     *
     * @param order Đơn hàng cần lấy danh sách sản phẩm
     * @return Danh sách OrderItem của đơn hàng
     */
    List<OrderItem> findByOrder(Order order);

    /**
     * Kiểm tra người dùng đã mua một sản phẩm trong đơn hàng có trạng thái chỉ định hay chưa.
     *
     * Method này thường dùng để xác định verified purchase
     * khi người dùng đánh giá sản phẩm.
     *
     * @param userId    ID người dùng
     * @param productId ID sản phẩm
     * @param status    Trạng thái đơn hàng cần kiểm tra
     * @return true nếu tồn tại OrderItem thỏa điều kiện, ngược lại false
     */
    boolean existsByOrder_User_UserIdAndProduct_ProductIdAndOrder_Status(
        Integer userId,
        Integer productId,
        OrderStatus status
    );
}
