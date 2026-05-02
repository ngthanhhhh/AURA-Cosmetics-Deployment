package com.cosmetics.ecommerce.controller;

import com.cosmetics.ecommerce.dto.ChangePasswordRequest;
import com.cosmetics.ecommerce.dto.UserProfileResponse;
import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    //PUT /api/v1/users/change-password
    //Customer tự đổi mật khẩu của mình
    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(@RequestBody ChangePasswordRequest request){
        //Lấy email của customer đang đăng nhập từ SecurityContext
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        userService.changePassword(email, request);
        return ResponseEntity.ok().build();
    }

    // GET /api/v1/users/me
    // Customer xem profile cá nhân
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(){
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return ResponseEntity.ok(userService.getProfileByEmail(email));
    }
}
