package com.cosmetics.ecommerce.controller;

import com.cosmetics.ecommerce.dto.AdminAccountRequest;
import com.cosmetics.ecommerce.dto.AdminAccountResponse;
import com.cosmetics.ecommerce.dto.ChangePasswordRequest;
import com.cosmetics.ecommerce.service.AdminAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/accounts")
@RequiredArgsConstructor
public class AdminAccountController {

    private final AdminAccountService adminAccountService;

    // GET /api/v1/admin/accounts
    // Lấy danh sách tất cả tài khoản admin
    @GetMapping
    public ResponseEntity<List<AdminAccountResponse>> getAllAccounts(){
        return ResponseEntity.ok(adminAccountService.getAllAccounts());
    }

    // POST /api/v1/admin/accounts
    // Thêm tài khoản admin mới
    @PostMapping
    public ResponseEntity<AdminAccountResponse> createAccount(
            @RequestBody AdminAccountRequest request) {
        return ResponseEntity.ok(adminAccountService.createAccount(request));
    }

    // PUT /api/v1/admin/accounts/{id}
    // Sửa thông tin tài khoản
    @PutMapping("/{id}")
    public ResponseEntity<AdminAccountResponse> updateAccount(
            @PathVariable Integer id,
            @RequestBody AdminAccountRequest request) {
        return ResponseEntity.ok(adminAccountService.updateAccount(id, request));
    }

    // DELETE /api/v1/admin/accounts/{id}
    // Xóa mềm tài khoản
    // @AuthenticationPrincipal lấy thông tin admin đang đăng nhập từ SecurityContext
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(
            @PathVariable Integer id) {
        String currentUserEmail = SecurityContextHolder.getContext()
                        .getAuthentication().getName();
        adminAccountService.deleteAccount(id, currentUserEmail);
        return ResponseEntity.ok().build();
    }

    // PUT /api/v1/admin/accounts/{id}/password
    // Đổi mật khẩu tài khoản
    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(
            @PathVariable Integer id,
            @RequestBody ChangePasswordRequest request) {
        adminAccountService.changePassword(id, request);
        return ResponseEntity.ok(
                Map.of("message", "Đổi mật khẩu thành công")
        );
    }
    // PUT /api/v1/admin/accounts/{id}/status
    // Mở / Khóa tài khoản admin
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, Boolean> request
    ){
        Boolean isActive = request.get("isActive");

        adminAccountService.updateStatus(id, isActive);

        return ResponseEntity.ok(
                Map.of("message", "Cập nhật trạng thái tài khoản thành công"));

    }

}
