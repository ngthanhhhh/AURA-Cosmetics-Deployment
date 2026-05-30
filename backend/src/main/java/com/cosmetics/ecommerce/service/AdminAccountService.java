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
     * Lấy danh sách tài khoản admin có phân trang,
     * tìm kiếm theo tên/email và lọc theo trạng thái hoạt động.
     *
     * @param keyword Từ khóa tìm kiếm theo tên hoặc email.
     * @param isActive Trạng thái hoạt động của tài khoản.
     * @param pageable Thông tin phân trang và sắp xếp.
     * @return Danh sách tài khoản admin dạng phân trang.
     */
    Page<AdminAccountResponse> getAllAccounts(String keyword, Boolean isActive, Pageable pageable);

    /**
     * Tạo tài khoản admin mới.
     *
     * @param request Thông tin tài khoản admin cần tạo.
     * @return Thông tin tài khoản admin sau khi tạo.
     */
    AdminAccountResponse createAccount(AdminAccountRequest request);

    /**
     * Cập nhật thông tin tài khoản admin.
     *
     * @param id ID tài khoản admin cần cập nhật.
     * @param request Thông tin tài khoản cần cập nhật.
     * @param currentUserEmail Email của admin đang đăng nhập.
     * @return Thông tin tài khoản admin sau khi cập nhật.
     */
    AdminAccountResponse updateAccount(Integer id, AdminAccountRequest request, String currentUserEmail);

    /**
     * Vô hiệu hóa tài khoản admin.
     *
     * Không xóa dữ liệu khỏi database,
     * chỉ cập nhật trạng thái isActive = false.
     *
     * @param id ID tài khoản admin cần vô hiệu hóa.
     * @param currentUserEmail Email của admin đang đăng nhập.
     */
    void deleteAccount(Integer id, String currentUserEmail);

    /**
     * Đổi mật khẩu tài khoản admin.
     *
     * @param id ID tài khoản admin cần đổi mật khẩu.
     * @param request Thông tin mật khẩu mới.
     */
    void changePassword(Integer id, ChangePasswordRequest request);

    /**
     * Khóa hoặc mở khóa tài khoản admin.
     *
     * @param id ID tài khoản admin cần cập nhật trạng thái.
     * @param isActive Trạng thái hoạt động mới.
     * @param currentUserEmail Email của admin đang đăng nhập.
     */
    void updateStatus(Integer id, Boolean isActive, String currentUserEmail);

}
