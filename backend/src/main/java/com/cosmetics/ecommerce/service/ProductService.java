package com.cosmetics.ecommerce.service;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;

import com.cosmetics.ecommerce.dto.ProductRequest;
import com.cosmetics.ecommerce.dto.ProductResponse;
import com.cosmetics.ecommerce.entity.Product;
import com.cosmetics.ecommerce.enums.ProductStatus;

/* =========================================================
 * PRODUCT SERVICE INTERFACE
 * ---------------------------------------------------------
 * Định nghĩa các nghiệp vụ chính liên quan đến sản phẩm.
 *
 * Interface này đóng vai trò trung gian giữa Controller và
 * phần triển khai nghiệp vụ ProductServiceImpl.
 *
 * Chức năng:
 * - Cung cấp danh sách sản phẩm công khai cho khách hàng.
 * - Cung cấp danh sách sản phẩm cho quản trị viên.
 * - Xem chi tiết sản phẩm.
 * - Thêm, cập nhật và xóa mềm sản phẩm.
 * ========================================================= */
public interface ProductService {

    /* =========================================================
     * LẤY DANH SÁCH SẢN PHẨM CÔNG KHAI
     * ---------------------------------------------------------
     * Dùng cho trang sản phẩm phía khách hàng.
     *
     * Hỗ trợ:
     * - Tìm kiếm theo từ khóa.
     * - Lọc theo danh mục.
     * - Lọc theo khoảng giá.
     * - Phân trang.
     * - Sắp xếp theo tiêu chí truyền vào.
     *
     * Chỉ trả về các sản phẩm đang ở trạng thái ACTIVE.
     * ========================================================= */
    Page<ProductResponse> getPublicProducts(
            String keyword,
            Integer categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            int page,
            int size,
            String sortBy,
            String direction
    );

    /* =========================================================
     * LẤY CHI TIẾT SẢN PHẨM CÔNG KHAI
     * ---------------------------------------------------------
     * Dùng cho trang chi tiết sản phẩm của khách hàng.
     *
     * Trả về thông tin sản phẩm đã được chuyển đổi sang
     * ProductResponse để phục vụ hiển thị trên frontend.
     * ========================================================= */
    ProductResponse getPublicProductDetail(Integer id);

    /* =========================================================
     * LẤY DANH SÁCH SẢN PHẨM CHO QUẢN TRỊ VIÊN
     * ---------------------------------------------------------
     * Dùng trong trang quản lý sản phẩm của admin.
     *
     * Hỗ trợ:
     * - Tìm kiếm theo từ khóa.
     * - Lọc theo danh mục.
     * - Lọc theo khoảng giá.
     * - Lọc theo trạng thái ACTIVE/INACTIVE.
     * - Phân trang và sắp xếp.
     * ========================================================= */
    Page<ProductResponse> getAdminProducts(
            String keyword,
            Integer categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            ProductStatus status,
            int page,
            int size,
            String sortBy,
            String direction
    );

    /* =========================================================
     * LẤY ENTITY PRODUCT THEO ID
     * ---------------------------------------------------------
     * Trả về trực tiếp Product entity.
     * Thường dùng trong các nghiệp vụ nội bộ cần thao tác
     * với entity thay vì DTO.
     * ========================================================= */
    Product getById(Integer id);

    /* =========================================================
     * THÊM SẢN PHẨM MỚI
     * ---------------------------------------------------------
     * Nhận dữ liệu từ ProductRequest, kiểm tra tính hợp lệ
     * và tạo sản phẩm mới trong hệ thống.
     * ========================================================= */
    ProductResponse create(ProductRequest request);

    /* =========================================================
     * CẬP NHẬT SẢN PHẨM
     * ---------------------------------------------------------
     * Cập nhật thông tin sản phẩm theo ID.
     * Dữ liệu cập nhật được truyền vào thông qua ProductRequest.
     * ========================================================= */
    ProductResponse update(Integer id, ProductRequest request);

    /* =========================================================
     * XÓA MỀM SẢN PHẨM
     * ---------------------------------------------------------
     * Không xóa sản phẩm khỏi database.
     * Thay vào đó cập nhật trạng thái sản phẩm sang INACTIVE
     * để bảo toàn dữ liệu lịch sử đơn hàng.
     * ========================================================= */
    void delete(Integer id);
}