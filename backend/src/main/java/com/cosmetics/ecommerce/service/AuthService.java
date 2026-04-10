package com.cosmetics.ecommerce.service;

import com.cosmetics.ecommerce.dto.AuthResponse;
import com.cosmetics.ecommerce.dto.LoginRequest;
import com.cosmetics.ecommerce.dto.RegisterRequest;
import com.cosmetics.ecommerce.entity.Role;
import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.repository.RoleRepository;
import com.cosmetics.ecommerce.repository.UserRepository;
import com.cosmetics.ecommerce.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // UC3.5 - Dang ky tai khoan (cho khach hang)
    public AuthResponse register(RegisterRequest request){
        //Kiểm tra email đã tồn tại
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new RuntimeException("Email nay da duoc dang ky");

        }

        //Chuyển đổi dữ liệu từ Request sang Entity User
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress());
        user.setPhone(request.getPhone());

        Role customerRole = roleRepository.findByRoleName("CUSTOMER")
                        .orElseThrow(() -> new RuntimeException("Loi: KHong tim thay quyen CUSTOMER trong he thong!"));

        user.setRole(customerRole);

        user.setIsActive(true);

        //Lưu vào Database
        userRepository.save(user);

        return AuthResponse.builder().message("Dang ky tai khoan thanh cong").build();
    }

    // dang nhap Admin - dang nhap Customer
    public AuthResponse login (LoginRequest request){
        //tìm user bằng email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoac mat khau khong chinh xac"));

        //so khớp mật khẩu đã băm
        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email hoac mat khau khong chinh xac");
        }

        //kiểm tra tài khoản có bị khóa không
        if(!user.getIsActive()){
            throw new RuntimeException("Tai khoan da bi khoa");
        }

        // 4. Tạo token (Sử dụng class JwtService bạn sắp viết)
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().getRoleName());

        // 5. Trả về thông tin cho Frontend
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().getRoleName())
                .name(user.getName())
                .message("Đăng nhập thành công")
                .build();
    }

}
