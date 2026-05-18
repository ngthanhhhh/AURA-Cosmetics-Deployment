package com.cosmetics.ecommerce.service;

import com.cosmetics.ecommerce.dto.CustomerResponse;
import com.cosmetics.ecommerce.dto.CustomerDetailResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
/**
 * Service xử lý nghiệp vụ quản lý khách hàng dành cho quản trị viên.
 */
public interface CustomerService {
    /**
     * Lấy danh sách khách hàng có tìm kiếm, lọc trạng thái và phân trang.
     *
     * @param keyword Từ khóa tìm kiếm theo tên hoặc email.
     * @param isActive Trạng thái hoạt động của tài khoản.
     * @param pageable Thông tin phân trang và sắp xếp.
     * @return Danh sách khách hàng dạng phân trang.
     */
    Page<CustomerResponse> getAllCustomers(String keyword,  Boolean isActive, Pageable pageable);

    /**
     * Lấy chi tiết khách hàng theo ID.
     *
     * @param id ID khách hàng.
     * @return Thông tin chi tiết khách hàng.
     */
    CustomerDetailResponse getCustomerDetail(Integer id);

    /**
     * Khóa hoặc mở khóa tài khoản khách hàng.
     *
     * @param id ID khách hàng.
     * @param isActive Trạng thái mới của tài khoản.
     */
    void updateStatus(Integer id, Boolean isActive);
}
