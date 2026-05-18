package com.cosmetics.ecommerce.controller;

import com.cosmetics.ecommerce.dto.ChangePasswordRequest;
import com.cosmetics.ecommerce.dto.UpdateProfileRequest;
import com.cosmetics.ecommerce.dto.UserProfileResponse;
import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.security.CurrentUserProvider;
import com.cosmetics.ecommerce.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;
import java.util.Map;

/**
 * API quản lý thông tin tài khoản cá nhân của người dùng đang đăng nhập.
 *
 * Controller này xử lý các chức năng:
 * - Xem thông tin profile cá nhân
 * - Cập nhật thông tin profile cá nhân
 * - Đổi mật khẩu
 *
 * Backend xác định user hiện tại thông qua JWT,
 * frontend không cần truyền userId.
 */

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final CurrentUserProvider currentUserProvider;
     /**
     * Đổi mật khẩu cho user đang đăng nhập.
     *
     * @param authentication Thông tin xác thực hiện tại từ Spring Security.
     * @param request Mật khẩu hiện tại và mật khẩu mới.
     * @return Thông báo đổi mật khẩu thành công.
     */
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request){
        //Lấy email của customer đang đăng nhập từ SecurityContext
        User currentUser = currentUserProvider.getCurrentUser(authentication);

        userService.changePassword(currentUser.getEmail(), request);

        return ResponseEntity.ok(
                Map.of("message", "Đổi mật khẩu thành công"));
    }

    /**
     * Lấy thông tin profile của user đang đăng nhập.
     *
     * @param authentication Thông tin xác thực hiện tại từ Spring Security.
     * @return Thông tin profile cá nhân.
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(Authentication authentication){
        User currentUser = currentUserProvider.getCurrentUser(authentication);

        return ResponseEntity.ok(userService.getProfileByEmail(currentUser.getEmail())
        );
    }

    /**
     * Cập nhật thông tin profile của user đang đăng nhập.
     *
     * @param authentication Thông tin xác thực hiện tại từ Spring Security.
     * @param request Thông tin profile cần cập nhật.
     * @return Thông báo cập nhật thành công.
     */
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request){

        User currentUser = currentUserProvider.getCurrentUser(authentication);

        userService.updateProfile(currentUser.getEmail(), request);

        return ResponseEntity.ok(
                Map.of("message", "Cập nhật thông tin thành công")
        );
    }
}
