package com.cosmetics.ecommerce.service.impl;

import com.cosmetics.ecommerce.service.AuthService;
import com.cosmetics.ecommerce.exception.BadRequestException;
import com.cosmetics.ecommerce.dto.*;
import com.cosmetics.ecommerce.entity.Cart;
import com.cosmetics.ecommerce.entity.Role;
import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.repository.RoleRepository;
import com.cosmetics.ecommerce.repository.UserRepository;
import com.cosmetics.ecommerce.utils.JwtUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.cosmetics.ecommerce.repository.CartRepository;

import org.springframework.transaction.annotation.Transactional;

/**
 * Service xử lý nghiệp vụ xác thực và tài khoản người dùng.
 *
 * Chức năng chính:
 * - Đăng ký tài khoản khách hàng
 * - Đăng nhập hệ thống
 * - Kiểm tra trạng thái tài khoản
 * - Sinh JWT token sau khi đăng nhập thành công
 */

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private final CartRepository cartRepository;

    /**
     * Đăng ký tài khoản khách hàng mới.
     *
     * Hệ thống sẽ:
     * - Validate dữ liệu đăng ký
     * - Kiểm tra email đã tồn tại chưa
     * - Gán ROLE_CUSTOMER mặc định
     * - Mã hóa mật khẩu bằng BCrypt
     * - Tạo giỏ hàng trống cho user mới
     *
     * @param request Thông tin đăng ký.
     */

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        validateRegisterRequest(request);

        String email = request.getEmail().trim().toLowerCase();

        // Kiểm tra email đã tồn tại
        if (userRepository.findByEmail(email).isPresent()) {
            throw new BadRequestException("Email này đã được đăng ký");
        }

        // Lấy role CUSTOMER
        Role customerRole = roleRepository.findByRoleName("ROLE_CUSTOMER")
                .orElseThrow(() -> new BadRequestException("Không tìm thấy ROLE_CUSTOMER"));

        // Tạo user
        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress());
        user.setPhone(request.getPhone().trim());
        user.setRole(customerRole);

        user.setIsActive(true);

        // Lưu vào Database
        User savedUser = userRepository.save(user);

        // Tạo giỏ hàng trống mặc đinh cho user mới
        Cart cart = new Cart();
        cart.setUser(savedUser);
        cartRepository.save(cart);

        return new RegisterResponse("Đăng ký tài khoản thành công");
    }

    /**
     * Đăng nhập hệ thống cho customer hoặc admin.
     *
     * Flow xử lý:
     * 1. Kiểm tra dữ liệu đăng nhập.
     * 2. Tìm user theo email.
     * 3. Kiểm tra mật khẩu.
     * 4. Kiểm tra trạng thái tài khoản.
     * 5. Tạo JWT token nếu đăng nhập thành công.
     *
     * @param request Thông tin đăng nhập từ frontend.
     * @return Thông tin user và JWT token.
     */

    @Override

    public LoginResponse login(LoginRequest request) {

        validateLoginRequest(request);

        String email = request.getEmail().trim().toLowerCase();

        // B1. Tìm user theo email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Email hoặc mật khẩu không chính xác"));

        // B2. Kiểm tra mật khẩu
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Email hoặc mật khẩu không chính xác");
        }

        // B3. Kiểm tra tài khoản có đang hoạt động không
        if (!user.getIsActive()) {
            throw new BadRequestException("Tài khoản đã bị vô hiệu hóa");
        }

        // B4. Tạo JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().getRoleName());

        // B5. Trả thông tin đăng nhập cho Frontend
        return new LoginResponse(
                token,
                user.getRole().getRoleName(),
                user.getName(),
                user.getEmail());
    }

    /**
     * Kiểm tra dữ liệu đăng ký hợp lệ trước khi tạo tài khoản.
     *
     * Bao gồm:
     * - Họ tên
     * - Email
     * - Số điện thoại
     * - Mật khẩu
     * - Xác nhận mật khẩu
     *
     * @param request Dữ liệu đăng ký từ frontend.
     */

    private void validateRegisterRequest(RegisterRequest request) {
        if (request == null) {
            throw new BadRequestException("Dữ liệu đăng ký không hợp lệ");
        }

        String name = request.getName() != null ? request.getName().trim() : null;
        String email = request.getEmail() != null ? request.getEmail().trim() : null;
        String phone = request.getPhone() != null ? request.getPhone().trim() : null;
        String password = request.getPassword();
        String confirm = request.getConfirmPassword();

        if (name == null || name.isBlank()) {
            throw new BadRequestException("Họ tên không được để trống");
        }

        if (email == null || email.isBlank()) {
            throw new BadRequestException("Email không được để trống");
        }

        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new BadRequestException("Email không đúng định dạng");
        }

        if (phone == null || !phone.matches("^\\d{10}$")) {
            throw new BadRequestException("Số điện thoại phải gồm 10 chữ số");
        }

        if (password == null || password.length() < 6) {
            throw new BadRequestException(("Mật khẩu phải có ít nhất 6 kí tự"));
        }

        // Mật khẩu mạnh
        if (!password.matches("^(?=.*[A-Za-z])(?=.*\\d).+$")) {
            throw new BadRequestException("Mật khẩu phải chứa chữ và số");
        }

        if (confirm == null ||
                !password.equals(confirm)) {
            throw new BadRequestException(("Mật khẩu xác nhận không khớp"));
        }

    }

    /**
     * Kiểm tra dữ liệu đăng nhập hợp lệ.
     *
     * @param request Dữ liệu đăng nhập từ frontend.
     */

    private void validateLoginRequest(LoginRequest request) {

        if (request == null) {
            throw new BadRequestException("Vui lòng nhập đầy đủ thông tin đăng nhập");
        }

        String email = request.getEmail() != null
                ? request.getEmail().trim()
                : null;
        if (email == null
                || email.isBlank()
                || request.getPassword() == null
                || request.getPassword().isBlank()) {

            throw new BadRequestException("Vui lòng nhập đầy đủ thông tin đăng nhập");
        }
    }

}
