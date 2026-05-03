package com.cosmetics.ecommerce.dto;
import lombok.Data;
@Data
public class ChangePasswordRequest {

    private String oldPassword; //dung cho user, admin khong dung
    private String newPassword;
    private String confirmPassword;
}
