package com.cosmetics.ecommerce.service;

import com.cosmetics.ecommerce.dto.AuthResponse;
import com.cosmetics.ecommerce.dto.LoginRequest;
import com.cosmetics.ecommerce.dto.RegisterRequest;
import com.cosmetics.ecommerce.entity.Role;
import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.repository.RoleRepository;
import com.cosmetics.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

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
//        User user = userRepository.findByEmail(request.getEmail())
//                .orElseThrow(() -> new RuntimeException("Email hoac mat khau khong chinh xac"));
//
//        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
//            throw new RuntimeException("Email hoac mat khau khong chinh xac");
//        }
//
//        if(!user.getIsActive()){
//            throw new RuntimeException("Tai khoan cua ban da bi khoa");
//        }
//
//        String role = user.getRole().getRoleName();
//        String token = jwtUtil.generateToken(user.getEmail(), role);
//        return new AuthResponse(token, role, user.getName());
        return null;
    }

}
