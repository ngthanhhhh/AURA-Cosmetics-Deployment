package com.cosmetics.ecommerce.service;
import com.cosmetics.ecommerce.dto.ChangePasswordRequest;
import com.cosmetics.ecommerce.dto.UpdateProfileRequest;
import com.cosmetics.ecommerce.dto.UserProfileResponse;

/**
 * Service xử lý nghiệp vụ tài khoản cá nhân của người dùng.
 */

public interface UserService {

    /**
     * Đổi mật khẩu cho user đang đăng nhập.
     *
     * @param email Email của user hiện tại.
     * @param request Thông tin mật khẩu hiện tại và mật khẩu mới.
     */
    void changePassword(String email, ChangePasswordRequest request);

    /**
     * Lấy thông tin profile cá nhân theo email.
     *
     * @param email Email của user hiện tại.
     * @return Thông tin profile cá nhân.
     */
    UserProfileResponse getProfileByEmail(String email);

    /**
     * Cập nhật thông tin profile cá nhân.
     *
     * @param email Email của user hiện tại.
     * @param request Thông tin profile cần cập nhật.
     */
    void updateProfile(String email, UpdateProfileRequest request);

}
