package com.cosmetics.ecommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.cosmetics.ecommerce.entity.CartItem;

/**
 * Repository thao tác với dữ liệu CartItem trong database.
 */
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer>{
    /**
     * Tìm một sản phẩm cụ thể trong giỏ hàng.
     *
     * @param cartId    ID của giỏ hàng
     * @param productId ID của sản phẩm
     * @return CartItem nếu sản phẩm đã tồn tại trong giỏ hàng
     */
    Optional<CartItem> findByCart_CartIdAndProduct_ProductId(Integer cartId, Integer productId);

    /**
     * Xóa toàn bộ sản phẩm trong một giỏ hàng.
     *
     * @param cartId ID của giỏ hàng cần xóa item
     */
    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.cart.cartId = :cartId")
    void deleteByCartId(Integer cartId);
}