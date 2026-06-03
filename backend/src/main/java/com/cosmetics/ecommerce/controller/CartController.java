package com.cosmetics.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
import com.cosmetics.ecommerce.security.CurrentUserProvider;
import com.cosmetics.ecommerce.service.CartService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controller quản lý giỏ hàng của khách hàng.
 *
 * Controller này nhận các request liên quan đến giỏ hàng,
 * lấy thông tin người dùng hiện tại từ Authentication,
 * sau đó gọi xuống CartService để xử lý nghiệp vụ.
 */
@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    private final CurrentUserProvider currentUserProvider;

    /**
     * Lấy thông tin giỏ hàng của người dùng hiện tại.
     *
     * API này dùng Authentication để xác định người dùng đang đăng nhập,
     * sau đó lấy giỏ hàng tương ứng của người dùng đó.
     *
     * @param authentication Thông tin xác thực của người dùng hiện tại.
     * @return ResponseEntity chứa thông tin giỏ hàng của người dùng.
     */
    @GetMapping
    public ResponseEntity<CartResponseDTO> getCart(Authentication authentication) {
        Integer userId = currentUserProvider.getCurrentUserId(authentication);
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    /**
     * Thêm sản phẩm vào giỏ hàng.
     *
     * API này lấy người dùng hiện tại từ Authentication,
     * sau đó thêm sản phẩm với số lượng được gửi trong request vào giỏ hàng.
     *
     * @param authentication Thông tin xác thực của người dùng hiện tại.
     * @param request        Dữ liệu sản phẩm cần thêm vào giỏ hàng,
     *                       gồm productId và quantity.
     * @return ResponseEntity chứa giỏ hàng sau khi thêm sản phẩm.
     */
    @PostMapping("/items")
    public ResponseEntity<CartResponseDTO> addToCart(
        Authentication authentication,
        @RequestBody @Valid CartItemRequestDTO request) {
        Integer userId = currentUserProvider.getCurrentUserId(authentication);
        return ResponseEntity.ok(cartService.addToCart(userId, request));
    }

    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng.
     *
     * API này dùng để thay đổi số lượng của một sản phẩm đã có trong giỏ hàng.
     *
     * @param authentication Thông tin xác thực của người dùng hiện tại.
     * @param request        Dữ liệu cập nhật giỏ hàng,
     *                       gồm productId và quantity mới.
     * @return ResponseEntity chứa giỏ hàng sau khi cập nhật.
     */
    @PutMapping("/items")
    public ResponseEntity<CartResponseDTO> updateCartItem(
        Authentication authentication,
        @RequestBody @Valid CartItemRequestDTO request) {
        Integer userId = currentUserProvider.getCurrentUserId(authentication);
        return ResponseEntity.ok(cartService.updateCartItem(userId, request));
    }

    /**
     * Xóa một sản phẩm khỏi giỏ hàng.
     *
     * API này lấy productId từ URL, xác định người dùng hiện tại,
     * sau đó xóa sản phẩm tương ứng khỏi giỏ hàng của người dùng đó.
     *
     * @param authentication Thông tin xác thực của người dùng hiện tại.
     * @param productId      ID của sản phẩm cần xóa khỏi giỏ hàng.
     * @return ResponseEntity không có nội dung, biểu thị xóa thành công.
     */
    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Void> removeCartItem(
        Authentication authentication,
        @PathVariable Integer productId){
        Integer userId = currentUserProvider.getCurrentUserId(authentication);
        cartService.removeCartItem(userId, productId);
        return ResponseEntity.noContent().build();
    }
}
