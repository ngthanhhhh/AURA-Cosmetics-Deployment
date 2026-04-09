package com.cosmetics.ecommerce.controller;

import com.cosmetics.ecommerce.dto.AuthResponse;
import com.cosmetics.ecommerce.dto.LoginRequest;
import com.cosmetics.ecommerce.dto.RegisterRequest;
import com.cosmetics.ecommerce.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    //dang ky tai khoan (Customer)
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    //Dang nhap Customer
    //Dang nhap Admin
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request){
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
