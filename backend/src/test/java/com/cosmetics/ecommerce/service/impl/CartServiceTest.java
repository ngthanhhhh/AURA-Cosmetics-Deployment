package com.cosmetics.ecommerce.service.impl;

import com.cosmetics.ecommerce.dto.CartItemRequestDTO;
import com.cosmetics.ecommerce.entity.Cart;
import com.cosmetics.ecommerce.entity.Product;
import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.enums.ProductStatus;
import com.cosmetics.ecommerce.exception.BadRequestException;
import com.cosmetics.ecommerce.repository.CartItemRepository;
import com.cosmetics.ecommerce.repository.CartRepository;
import com.cosmetics.ecommerce.repository.ProductRepository;
import com.cosmetics.ecommerce.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartServiceImpl cartService;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setProductId(1);
        product.setName("Test Product");
        product.setPrice(BigDecimal.valueOf(100000));
        product.setStock(5);
        product.setStatus(ProductStatus.ACTIVE);
    }

    @Test
    void addToCart_ShouldThrowException_WhenQuantityLessThanOrEqualZero() {

        CartItemRequestDTO request = new CartItemRequestDTO();
        request.setProductId(1);
        request.setQuantity(0);

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> cartService.addToCart(1, request));

        assertEquals(
                "Số lượng thêm vào giỏ hàng phải lớn hơn 0!",
                exception.getMessage());
    }

    @Test
    void addToCart_ShouldThrowException_WhenProductInactive() {
        product.setStatus(ProductStatus.INACTIVE);

        when(productRepository.findById(1))
                .thenReturn(Optional.of(product));

        CartItemRequestDTO request = new CartItemRequestDTO();
        request.setProductId(1);
        request.setQuantity(1);

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> cartService.addToCart(1, request));

        assertEquals(
                "Sản phẩm đã ngừng bán!",
                exception.getMessage());
    }

    @Test
    void addToCart_ShouldThrowException_WhenQuantityExceedsStock() {
        User user = new User();
        user.setUserId(1);

        Cart cart = new Cart();
        cart.setCartId(1);
        cart.setUser(user);
        cart.setCartItems(new ArrayList<>());

        when(productRepository.findById(1))
                .thenReturn(Optional.of(product));

        when(cartRepository.findByUser_UserId(1))
                .thenReturn(Optional.of(cart));

        when(cartItemRepository.findByCart_CartIdAndProduct_ProductId(1, 1)).
                thenReturn(Optional.empty());

        CartItemRequestDTO request = new CartItemRequestDTO();
        request.setProductId(1);
        request.setQuantity(10);

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> cartService.addToCart(1, request));

        assertTrue(
                exception.getMessage().contains("Tồn kho không đủ"));
    }
}
