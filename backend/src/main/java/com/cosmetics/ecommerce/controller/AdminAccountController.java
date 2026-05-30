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
 * Chỉ người dùng có ROLE_ADMIN được phép truy cập các API này.
 * Controller hỗ trợ các chức năng:
 * - Xem danh sách tài khoản admin
 * - Tạo tài khoản admin mới
 * - Cập nhật thông tin tài khoản admin
 * - Vô hiệu hóa tài khoản admin
 * - Đổi mật khẩu tài khoản admin
 * - Khóa hoặc mở khóa tài khoản admin
 */
@RestController
@RequestMapping("/api/v1/admin/accounts")
@RequiredArgsConstructor
public class AdminAccountController {

    private final AdminAccountService adminAccountService;
    private final CurrentUserProvider currentUserProvider;

    /**
     * Lấy danh sách tài khoản admin có phân trang, tìm kiếm,
     * lọc trạng thái và sắp xếp.
     *
     * @param keyword Từ khóa tìm kiếm theo tên hoặc email.
     * @param isActive Trạng thái hoạt động của tài khoản.
     * @param page Trang hiện tại.
     * @param size Số lượng tài khoản mỗi trang.
     * @param sortField Trường dùng để sắp xếp.
     * @param sortDir Hướng sắp xếp: asc hoặc desc.
     * @return Danh sách tài khoản admin dạng phân trang.
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
     *
     * @param request Thông tin tài khoản admin cần tạo.
     * @return Thông tin tài khoản admin sau khi tạo thành công.
     */
    @PostMapping
    public ResponseEntity<AdminAccountResponse> createAccount(
            @RequestBody AdminAccountRequest request) {
        return ResponseEntity.ok(adminAccountService.createAccount(request));
    }

    /**
     * Cập nhật thông tin tài khoản admin.
     */
    /**
     * * Cập nhật thông tin tài khoản admin.
     * *
     * * API này không xử lý đổi mật khẩu.
     * * Hệ thống xác định admin đang đăng nhập để kiểm soát
     * * trường hợp tự vô hiệu hóa chính tài khoản của mình.
     * *
     * * @param id ID tài khoản admin cần cập nhật.
     * * @param request Thông tin tài khoản cần cập nhật.
     * * @param authentication Thông tin xác thực của admin hiện tại.
     * * @return Thông tin tài khoản admin sau khi cập nhật.
     *
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
     * Vô hiệu hóa tài khoản admin.
     *
     * Hệ thống không xóa dữ liệu khỏi database,
     * chỉ cập nhật trạng thái isActive = false.
     * Không cho phép admin tự vô hiệu hóa chính mình.
     *
     * @param id ID tài khoản admin cần vô hiệu hóa.
     * @param authentication Thông tin xác thực của admin hiện tại.
     * @return Thông báo vô hiệu hóa tài khoản thành công.
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
     * Đổi mật khẩu tài khoản admin.
     *
     * Flow xử lý:
     * - Validate dữ liệu đổi mật khẩu
     * - Kiểm tra tài khoản tồn tại
     * - Kiểm tra tài khoản cần xử lý có ROLE_ADMIN
     * - Kiểm tra mật khẩu mới không trùng mật khẩu cũ
     * - Mã hóa và lưu mật khẩu mới
     *
     * API này chỉ sử dụng mật khẩu mới và xác nhận mật khẩu mới
     * trong ChangePasswordRequest, không yêu cầu mật khẩu cũ
     * vì thao tác được thực hiện bởi admin.
     *
     * @param id ID tài khoản admin cần đổi mật khẩu.
     * @param request Thông tin đổi mật khẩu.
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
     *
     * Hệ thống không cho phép admin đang đăng nhập
     * tự khóa chính tài khoản của mình.
     *
     * @param id ID tài khoản admin cần cập nhật trạng thái.
     * @param request Trạng thái hoạt động mới của tài khoản.
     * @param authentication Thông tin xác thực của admin hiện tại.
     * @return Thông báo cập nhật trạng thái thành công.
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
