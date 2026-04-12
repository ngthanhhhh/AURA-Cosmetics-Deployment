package com.cosmetics.ecommerce.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cosmetics.ecommerce.dto.CartItemRequestDTO;
import com.cosmetics.ecommerce.dto.CartItemResponseDTO;
import com.cosmetics.ecommerce.dto.CartResponseDTO;
import com.cosmetics.ecommerce.entity.Cart;
import com.cosmetics.ecommerce.entity.CartItem;
import com.cosmetics.ecommerce.entity.Product;
import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.exception.BadRequestException;
import com.cosmetics.ecommerce.exception.ResourceNotFoundException;
import com.cosmetics.ecommerce.repository.CartItemRepository;
import com.cosmetics.ecommerce.repository.CartRepository;
import com.cosmetics.ecommerce.repository.ProductRepository;
import com.cosmetics.ecommerce.repository.UserRepository;
import com.cosmetics.ecommerce.service.CartService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService{
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private static final int MAX_QUANTITY_PER_ITEM = 99;

    @Override
    @Transactional
    public CartResponseDTO getCartByUserId(Integer userId) {
        Cart cart = getOrCreateCart(userId);
        return mapToCartResponse(cart);
    }

    @Override
    public CartResponseDTO addToCart(Integer userId, CartItemRequestDTO request) {
        validateRequestBasic(request);
        Product product = getValidProduct(request.getProductId());
        Cart cart = getOrCreateCart(userId);
        CartItem cartItem = getOrCreateCartItem(cart, product);

        int newQuantity = cartItem.getCartItemId() == null 
            ? request.getQuantity() 
            : cartItem.getQuantity() + request.getQuantity();

        validateQuantityLimits(product, newQuantity);

        cartItem.setQuantity(newQuantity);
        cartItemRepository.save(cartItem);

        return mapToCartResponse(cart);
    }

    @Override
    public CartResponseDTO updateCartItem(Integer userId, CartItemRequestDTO request){
        validateRequestBasic(request);
        Product product = getValidProduct(request.getProductId());

        if (request.getQuantity() == 0){
            removeCartItem(userId, product.getProductId());
            return getCartByUserId(userId);
        }

        Cart cart = getOrCreateCart(userId);

        CartItem cartItem = cartItemRepository
            .findByCart_CartIdAndProduct_ProductId(cart.getCartId(), product.getProductId())
            .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm chưa có trong giỏ hàng để cập nhật!"));

        int newQuantity = request.getQuantity();
        validateQuantityLimits(product, newQuantity);

        cartItem.setQuantity(newQuantity);
        cartItemRepository.save(cartItem);

        return mapToCartResponse(cart);
    }

    @Override
    public void removeCartItem(Integer userId, Integer productId) {
        Cart cart = getOrCreateCart(userId);

        CartItem cartItem = cartItemRepository
            .findByCart_CartIdAndProduct_ProductId(cart.getCartId(), productId)
            .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không có trong giỏ hàng"));

        cartItemRepository.delete(cartItem);
    }

    private Cart getOrCreateCart(Integer userId) {
        return cartRepository.findByUser_UserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    private CartResponseDTO mapToCartResponse(Cart cart) {
        List<CartItemResponseDTO> items = Optional.ofNullable(cart.getCartItems())
                .orElse(List.of())
                .stream()
                .map(this::mapToCartItemResponse)
                .toList();
        BigDecimal totalCartValue = items.stream()
                .map(CartItemResponseDTO::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return CartResponseDTO.builder()
                .cartId(cart.getCartId())
                .userId(cart.getUser().getUserId())
                .items(items)
                .totalCartValue(totalCartValue)
                .build();                
    }

    private CartItemResponseDTO mapToCartItemResponse(CartItem item){
        BigDecimal unitPrice = item.getProduct().getPrice();
        BigDecimal totalPrice = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

        return CartItemResponseDTO.builder()
                    .cartItemId(item.getCartItemId())
                    .productId(item.getProduct().getProductId())
                    .productName(item.getProduct().getName())
                    .productImage(item.getProduct().getImage())
                    .quantity(item.getQuantity())
                    .unitPrice(unitPrice)
                    .totalPrice(totalPrice)
                    .build();
    }

    private void validateRequestBasic(CartItemRequestDTO request) {
        if (request.getProductId() == null ) {
            throw new BadRequestException("Mã sản phẩm không được để trống!");
        }
        if (request.getQuantity() == null || request.getQuantity() < 0) {
            throw new BadRequestException("Số lượng không hợp lệ");
        }
    }

    private Product getValidProduct(Integer productId) {
        Product product = productRepository.findById(productId)
                            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm!!!"));

        if (!"ACTIVE".equals(product.getStatus().name())) {
            throw new BadRequestException("Sản phẩm đã ngừng bán!");
        }
        return product;
    }

    private CartItem getOrCreateCartItem(Cart cart, Product product) {
        return cartItemRepository
                .findByCart_CartIdAndProduct_ProductId(cart.getCartId(), product.getProductId())
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setCart(cart);
                    newItem.setProduct(product);
                    return newItem;
                });
    }

    private void validateQuantityLimits(Product product, int targetQuantity) {
        if (targetQuantity > MAX_QUANTITY_PER_ITEM) {
            throw new BadRequestException("Chỉ được mua tối đa" +  MAX_QUANTITY_PER_ITEM + " sản phẩm mỗi loại!");
        }
        
        if (product.getStock() < targetQuantity) {
            throw new BadRequestException("Tồn kho không đủ. Chỉ còn " + product.getStock() + " sản phẩn!");
        }
    }
}
