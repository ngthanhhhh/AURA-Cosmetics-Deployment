package com.cosmetics.ecommerce.service;
import com.cosmetics.ecommerce.dto.ChangePasswordRequest;

public interface UserService {

    //UC3.7 - Đổi mật khẩu cho customer đang đăng nhập
    void changePassword(String email, ChangePasswordRequest request);
}
