package com.cosmetics.ecommerce.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String role;
    private String email;
}
