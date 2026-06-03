package com.cosmetics.ecommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cosmetics.ecommerce.entity.Cart;

/**
 * Repository thao tác với dữ liệu Cart trong database.
 */
@Repository
public interface CartRepository extends JpaRepository<Cart, Integer>{
    /**
     * Tìm giỏ hàng theo userId, 
     * đồng thời dùng @EntityGraph để load sẵn cart items và product, 
     * giúp lấy dữ liệu giỏ hàng đầy đủ hơn và hạn chế query lặp
     *
     * @param userId ID của người dùng
     * @return Cart của người dùng nếu tồn tại
     */
    @EntityGraph(attributePaths = {"cartItems", "cartItems.product"})
    Optional<Cart> findByUser_UserId(Integer userId);    
}