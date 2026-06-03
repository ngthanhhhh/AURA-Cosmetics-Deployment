package com.cosmetics.ecommerce.controller;

import com.cosmetics.ecommerce.dto.*;
import com.cosmetics.ecommerce.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller xử lý các chức năng xác thực người dùng.
 *
 * Bao gồm:
 * - Đăng ký tài khoản khách hàng
 * - Đăng nhập hệ thống
 *
 * Base URL:
 * /api/v1/auth
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    /**
     * Service xử lý nghiệp vụ xác thực.
     */
    private final AuthService authService;

    /**
     * Đăng ký tài khoản khách hàng mới.
     *
     * Quy trình:
     * - Nhận thông tin đăng ký từ client
     * - Kiểm tra dữ liệu hợp lệ
     * - Kiểm tra email đã tồn tại hay chưa
     * - Tạo tài khoản với ROLE_CUSTOMER
     * - Trả về kết quả đăng ký
     *
     * API:
     * POST /api/v1/auth/register
     *
     * @param request thông tin đăng ký
     * @return kết quả đăng ký
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        RegisterResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Đăng nhập hệ thống.
     *
     * Quy trình:
     * - Kiểm tra email và mật khẩu
     * - Xác thực tài khoản
     * - Sinh JWT token nếu đăng nhập thành công
     * - Trả về thông tin người dùng và token
     *
     * Hỗ trợ:
     * - ROLE_CUSTOMER
     * - ROLE_ADMIN
     *
     * API:
     * POST /api/v1/auth/login
     *
     * @param request thông tin đăng nhập
     * @return JWT token và thông tin tài khoản
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request){

        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }


}
