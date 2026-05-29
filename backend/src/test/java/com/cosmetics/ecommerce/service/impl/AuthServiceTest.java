package com.cosmetics.ecommerce.service.impl;

import com.cosmetics.ecommerce.dto.LoginRequest;
import com.cosmetics.ecommerce.dto.LoginResponse;
import com.cosmetics.ecommerce.dto.RegisterRequest;
import com.cosmetics.ecommerce.entity.Role;
import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.exception.BadRequestException;
import com.cosmetics.ecommerce.repository.CartRepository;
import com.cosmetics.ecommerce.repository.RoleRepository;
import com.cosmetics.ecommerce.repository.UserRepository;
import com.cosmetics.ecommerce.service.AuthService;
import com.cosmetics.ecommerce.utils.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists(){
        RegisterRequest request = new RegisterRequest();
        request.setName("Nguyen Van A");
        request.setEmail("test@gmail.com");
        request.setPhone("0123456789");
        request.setPassword("acb123");
        request.setConfirmPassword("acb123");

        User existingUser = new User();
        existingUser.setEmail("test@gmail.com");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(existingUser));

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> authService.register(request)
        );

        assertEquals("Email này đã được đăng ký",
                exception.getMessage());
    }

    @Test
    void login_ShouldReturnToken_WhenLoginSuccess(){
        Role role = new Role();
        role.setRoleName("ROLE_CUSTOMER");

        User user = new User();
        user.setName("Nguyen Van A");
        user.setEmail("test@gmail.com");
        user.setPassword("encodedPassword");
        user.setRole(role);
        user.setIsActive(true);

        LoginRequest request = new LoginRequest();
        request.setEmail("test@gmail.com");
        request.setPassword("abc123");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("abc123", "encodedPassword"))
                .thenReturn(true);

        when(jwtUtil.generateToken("test@gmail.com", "ROLE_CUSTOMER"))
                .thenReturn("fake-jwt-token");

        LoginResponse response = authService.login(request);

        assertEquals("fake-jwt-token", response.getToken());
        assertEquals("ROLE_CUSTOMER", response.getRole());
        assertEquals("Nguyen Van A", response.getName());
        assertEquals("test@gmail.com", response.getEmail());
    }
}
