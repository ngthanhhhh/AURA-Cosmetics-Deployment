package com.cosmetics.ecommerce.security;

import com.cosmetics.ecommerce.exception.BadRequestException;
import com.cosmetics.ecommerce.exception.ResourceNotFoundException;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;

 /**
 * Component hỗ trợ lấy thông tin người dùng hiện tại
 * từ Authentication/SecurityContext.
 *
 * Dùng để:
 * - lấy current user
 * - lấy current userId
 * - kiểm tra trạng thái đăng nhập
 * - kiểm tra tài khoản còn hoạt động
 */

@Component
@RequiredArgsConstructor
public class CurrentUserProvider {
    private final UserRepository userRepository;

      /**
      * Lấy entity User của người dùng đang đăng nhập.
      *
      * @param authentication Authentication hiện tại từ Spring Security.
      * @return User hiện tại.
      */

    public User getCurrentUser(Authentication authentication) {

        // Kiểm tra user đã đăng nhập chưa
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("Người dùng chưa đăng nhập!");
        }

        // Tìm user theo email trong JWT
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng hiện tại!"));

        // Kiểm tra tài khoản còn hoạt động không
        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new BadRequestException("Tài khoản đã bị khóa!");
        }

        return user;
    }

      /**
      * Lấy userId của người dùng đang đăng nhập.
      *
      * @param authentication Authentication hiện tại.
      * @return ID của user hiện tại.
      */
    public Integer getCurrentUserId(Authentication authentication) {
        return getCurrentUser(authentication).getUserId();
    }
}
