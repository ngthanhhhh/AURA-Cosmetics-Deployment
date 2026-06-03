package com.cosmetics.ecommerce.service;

import com.cosmetics.ecommerce.dto.CartItemRequestDTO;
import com.cosmetics.ecommerce.dto.CartResponseDTO;

/**
 * Service định nghĩa các nghiệp vụ liên quan đến giỏ hàng của người dùng.
 */
public interface CartService {
    /**
     * Lấy thông tin giỏ hàng của người dùng.
     *
     * @param userId ID người dùng
     * @return Thông tin giỏ hàng
     */
    CartResponseDTO getCartByUserId(Integer userId);

    /**
     * Thêm sản phẩm vào giỏ hàng.
     *
     * @param userId  ID người dùng
     * @param request Thông tin sản phẩm và số lượng cần thêm
     * @return Thông tin giỏ hàng sau khi thêm sản phẩm
     */
    CartResponseDTO addToCart(Integer userId, CartItemRequestDTO request);

    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng.
     *
     * @param userId  ID người dùng
     * @param request Thông tin sản phẩm và số lượng mới
     * @return Thông tin giỏ hàng sau khi cập nhật
     */
    CartResponseDTO updateCartItem(Integer userId, CartItemRequestDTO request);

    /**
     * Xóa một sản phẩm khỏi giỏ hàng.
     *
     * @param userId    ID người dùng
     * @param productId ID sản phẩm cần xóa khỏi giỏ hàng
     */
    void removeCartItem(Integer userId, Integer productId);
}
