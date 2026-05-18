package com.cosmetics.ecommerce.service;

import com.cosmetics.ecommerce.dto.AdminAccountRequest;
import com.cosmetics.ecommerce.dto.AdminAccountResponse;
import com.cosmetics.ecommerce.dto.ChangePasswordRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service xử lý nghiệp vụ quản lý tài khoản quản trị viên.
 */
public interface AdminAccountService {

    /**
     * Lấy danh sách tài khoản admin có phân trang, tìm kiếm và lọc trạng thái.
     */
    Page<AdminAccountResponse> getAllAccounts(String keyword, Boolean isActive, Pageable pageable);

    /**
     * Tạo tài khoản admin mới.
     */
    AdminAccountResponse createAccount(AdminAccountRequest request);

    /**
     * Cập nhật thông tin tài khoản admin.
     *
     * @param currentUserEmail Email của admin đang đăng nhập.
     */
    AdminAccountResponse updateAccount(Integer id, AdminAccountRequest request, String currentUserEmail);

    /**
     * Vô hiệu hóa tài khoản admin.
     *
     * Không cho phép admin tự vô hiệu hóa chính mình.
     */
    void deleteAccount(Integer id, String currentUserEmail);

    /**
     * Đổi mật khẩu tài khoản admin.
     */
    void changePassword(Integer id, ChangePasswordRequest request);

    /**
     * Khóa hoặc mở khóa tài khoản admin.
     *
     * @param currentUserEmail Email của admin đang đăng nhập.
     */
    void updateStatus(Integer id, Boolean isActive, String currentUserEmail);

}
