package com.cosmetics.ecommerce.service;

import com.cosmetics.ecommerce.dto.LoginRequest;
import com.cosmetics.ecommerce.dto.LoginResponse;
import com.cosmetics.ecommerce.dto.RegisterRequest;
import com.cosmetics.ecommerce.dto.RegisterResponse;

/**
 * Service xử lý nghiệp vụ xác thực người dùng.
 *
 * Bao gồm:
 * - Đăng ký tài khoản khách hàng
 * - Đăng nhập hệ thống
 */
public interface AuthService {

    /**
     * Đăng ký tài khoản khách hàng mới.
     *
     * Hệ thống sẽ kiểm tra dữ liệu đăng ký,
     * kiểm tra email đã tồn tại hay chưa,
     * tạo tài khoản mới với quyền ROLE_CUSTOMER
     * và lưu vào cơ sở dữ liệu.
     *
     * @param request Thông tin đăng ký tài khoản.
     * @return Kết quả đăng ký.
     */
    RegisterResponse register(RegisterRequest request);

    /**
     * Đăng nhập hệ thống.
     *
     * Hệ thống sẽ kiểm tra email và mật khẩu,
     * xác thực tài khoản người dùng
     * và trả về JWT token nếu đăng nhập thành công.
     *
     * @param request Thông tin đăng nhập.
     * @return Thông tin người dùng và JWT token.
     */
    LoginResponse login(LoginRequest request);

}
