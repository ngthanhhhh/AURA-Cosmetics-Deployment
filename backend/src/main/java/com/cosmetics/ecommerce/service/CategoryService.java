package com.cosmetics.ecommerce.service;

import org.springframework.data.domain.Page;

import com.cosmetics.ecommerce.entity.Category;

/* =========================================================
 * CATEGORY SERVICE INTERFACE
 * ---------------------------------------------------------
 * Định nghĩa các nghiệp vụ chính liên quan đến danh mục.
 *
 * Interface này đóng vai trò trung gian giữa Controller và
 * phần triển khai nghiệp vụ CategoryServiceImpl.
 *
 * Chức năng:
 * - Lấy danh sách danh mục.
 * - Xem chi tiết danh mục.
 * - Thêm danh mục mới.
 * - Cập nhật danh mục.
 * - Xóa danh mục.
 * ========================================================= */
public interface CategoryService {

    /* =========================================================
     * LẤY DANH SÁCH DANH MỤC
     * ---------------------------------------------------------
     * Hỗ trợ:
     * - Tìm kiếm theo từ khóa.
     * - Phân trang dữ liệu.
     * - Sắp xếp theo thuộc tính bất kỳ.
     *
     * Trả về dữ liệu dưới dạng Page<Category>.
     * ========================================================= */
    Page<Category> getAll(
            String keyword,
            int page,
            int size,
            String sortBy,
            String direction
    );

    /* =========================================================
     * LẤY CHI TIẾT DANH MỤC
     * ---------------------------------------------------------
     * Trả về thông tin danh mục theo ID.
     * Nếu không tồn tại sẽ được xử lý tại tầng ServiceImpl.
     * ========================================================= */
    Category getById(Integer id);

    /* =========================================================
     * THÊM DANH MỤC MỚI
     * ---------------------------------------------------------
     * Tiếp nhận dữ liệu danh mục từ Controller.
     * Thực hiện kiểm tra hợp lệ trước khi lưu xuống database.
     * ========================================================= */
    Category create(Category category);

    /* =========================================================
     * CẬP NHẬT DANH MỤC
     * ---------------------------------------------------------
     * Cập nhật thông tin danh mục theo ID.
     * Bao gồm tên danh mục và mô tả danh mục.
     * ========================================================= */
    Category update(Integer id, Category category);

    /* =========================================================
     * XÓA DANH MỤC
     * ---------------------------------------------------------
     * Xóa danh mục khỏi hệ thống.
     * Trước khi xóa sẽ kiểm tra các ràng buộc liên quan,
     * ví dụ danh mục còn chứa sản phẩm hay không.
     * ========================================================= */
    void delete(Integer id);
}