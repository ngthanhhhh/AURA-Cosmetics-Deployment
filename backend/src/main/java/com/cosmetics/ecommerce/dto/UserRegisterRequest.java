package com.cosmetics.ecommerce.dto;

import lombok.Data;

@Data
public class UserRegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String address;
}
