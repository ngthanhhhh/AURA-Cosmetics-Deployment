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
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email nay da duoc dang ky");

        }

        Role role = roleRepository.findByRoleName("CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Role CUSTOMER khong ton tai"));

        User user = new User();
        user.setName(request.getName());
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress());
        user.setPhone(request.getPhone());
        user.setRole(role);
        user.setIsActive(true);

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), role.getRoleName());
        return new AuthResponse(token, role.getRoleName(), user.getName());
    }

    // dang nhap Admin - dang nhap Customer
    public AuthResponse login (LoginRequest request){
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoac mat khau khong chinh xac"));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email hoac mat khau khong chinh xac");
        }

        if(!user.getIsActive()){
            throw new RuntimeException("Tai khoan cua ban da bi khoa");
        }

        String role = user.getRole().getRoleName();
        String token = jwtUtil.generateToken(user.getEmail(), role);
        return new AuthResponse(token, role, user.getName());
    }

}
