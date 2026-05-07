package com.cosmetics.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cosmetics.ecommerce.dto.CartItemRequestDTO;
import com.cosmetics.ecommerce.dto.CartResponseDTO;
import com.cosmetics.ecommerce.service.CartService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponseDTO> getCart() {
        Integer userId = 1;
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponseDTO> addToCart(@RequestBody @Valid CartItemRequestDTO request) {
        // TODO: Tạm thời fix cứng userId = 1 để test.
        Integer userId = 1;
        return ResponseEntity.ok(cartService.addToCart(userId, request));
    }

    @PutMapping("/items")
    public ResponseEntity<CartResponseDTO> updateCartItem(@RequestBody @Valid CartItemRequestDTO request) {
        Integer userId = 1;
        return ResponseEntity.ok(cartService.updateCartItem(userId, request));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Void> removeCartItem(@PathVariable Integer productId){
        Integer userId = 1;
        cartService.removeCartItem(userId, productId);
        return ResponseEntity.noContent().build();
    }
}
