package com.cosmetics.ecommerce.controller;

import com.cosmetics.ecommerce.dto.AdminAccountRequest;
import com.cosmetics.ecommerce.dto.AdminAccountResponse;
import com.cosmetics.ecommerce.dto.ChangePasswordRequest;
import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.exception.BadRequestException;
import com.cosmetics.ecommerce.security.CurrentUserProvider;
import com.cosmetics.ecommerce.service.AdminAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * API quản lý tài khoản quản trị viên.
 *
 * Chỉ ROLE_ADMIN được phép truy cập các API này.
 * Controller hỗ trợ xem danh sách, thêm, sửa, khóa/mở khóa
 * và đổi mật khẩu tài khoản admin.
 */
@RestController
@RequestMapping("/api/v1/admin/accounts")
@RequiredArgsConstructor
public class AdminAccountController {

    private final AdminAccountService adminAccountService;
    private final CurrentUserProvider currentUserProvider;

    /**
     * Lấy danh sách tài khoản admin có phân trang, tìm kiếm, lọc trạng thái và sắp xếp.
     */
    @GetMapping
    public ResponseEntity<Page<AdminAccountResponse>> getAllAccounts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir
    ){
        if(page < 0){
            throw new BadRequestException("Số trang không hợp lệ");
        }

        if(size <= 0){
            throw new BadRequestException("Kích thước trang không hợp lệ");
        }

        if(size > 100){
            throw new BadRequestException("Kích thước trang quá lớn");
        }

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortField).ascending()
                : Sort.by(sortField).descending();

        Pageable pageable = PageRequest.of(
                page,
                size,
                sort);

        return ResponseEntity.ok(
                adminAccountService.getAllAccounts(keyword, isActive, pageable)
        );
    }

    /**
     * Tạo tài khoản admin mới.
     */
    @PostMapping
    public ResponseEntity<AdminAccountResponse> createAccount(
            @RequestBody AdminAccountRequest request) {
        return ResponseEntity.ok(adminAccountService.createAccount(request));
    }

    /**
     * Cập nhật thông tin tài khoản admin.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AdminAccountResponse> updateAccount(
            @PathVariable Integer id,
            @RequestBody AdminAccountRequest request,
            Authentication authentication) {

        User currentAdmin = currentUserProvider.getCurrentUser(authentication);

        return ResponseEntity.ok(
                adminAccountService.updateAccount(id, request, currentAdmin.getEmail())
        );
    }

    /**
     * Khóa mềm tài khoản admin.
     * <p>
     * Không xóa dữ liệu khỏi database, chỉ cập nhật isActive = false.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteAccount(
            @PathVariable Integer id,
            Authentication authentication) {
        User currentAdmin = currentUserProvider.getCurrentUser(authentication);

        adminAccountService.deleteAccount(id, currentAdmin.getEmail());

        return ResponseEntity.ok(Map.of("message", "Vô hiệu hóa tài khoản thành công"));
    }

    /**
     * Đổi mật khẩu cho tài khoản admin.
     */
    @PutMapping("/{id}/password")
    public ResponseEntity<Map<String, String>> changePassword(
            @PathVariable Integer id,
            @RequestBody ChangePasswordRequest request) {

        adminAccountService.changePassword(id, request);
        return ResponseEntity.ok(
                Map.of("message", "Đổi mật khẩu thành công")
        );
    }
    /**
     * Khóa hoặc mở khóa tài khoản admin.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, String>> updateStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, Boolean> request,
            Authentication authentication
    ){
        Boolean isActive = request.get("isActive");

        if(isActive == null){
            throw new BadRequestException("Thiếu trạng thái tài khoản");
        }

        User currentAdmin = currentUserProvider.getCurrentUser(authentication);

        adminAccountService.updateStatus(id, isActive, currentAdmin.getEmail());

        return ResponseEntity.ok(
                Map.of("message", "Cập nhật trạng thái tài khoản thành công"));

    }

}
