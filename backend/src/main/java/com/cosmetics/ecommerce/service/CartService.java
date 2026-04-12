package com.cosmetics.ecommerce.service;

import com.cosmetics.ecommerce.dto.CartItemRequestDTO;
import com.cosmetics.ecommerce.dto.CartResponseDTO;

public interface CartService {
    CartResponseDTO getCartByUserId(Integer userId);
    CartResponseDTO addToCart(Integer userId, CartItemRequestDTO request);
    CartResponseDTO updateCartItem(Integer userId, CartItemRequestDTO request);
    void removeCartItem(Integer userId, Integer productId);
}
