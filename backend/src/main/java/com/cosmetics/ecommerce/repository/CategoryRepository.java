package com.cosmetics.ecommerce.repository;

import com.cosmetics.ecommerce.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/* =========================================================
 * CATEGORY REPOSITORY
 * ---------------------------------------------------------
 * Là tầng truy xuất dữ liệu của bảng categories.
 *
 * Chức năng:
 * - Kế thừa JpaRepository để có sẵn các thao tác CRUD cơ bản.
 * - Kiểm tra tên danh mục đã tồn tại hay chưa.
 * - Tìm kiếm danh mục theo từ khóa có hỗ trợ phân trang.
 * ========================================================= */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    /* =========================================================
     * KIỂM TRA TÊN DANH MỤC ĐÃ TỒN TẠI
     * ---------------------------------------------------------
     * Dùng khi thêm hoặc cập nhật danh mục để tránh trùng tên.
     * ========================================================= */
    boolean existsByName(String name);

    /* =========================================================
     * TÌM KIẾM DANH MỤC THEO TÊN
     * ---------------------------------------------------------
     * Tìm các danh mục có tên chứa keyword.
     * Không phân biệt chữ hoa/thường.
     * Kết quả được phân trang thông qua Pageable.
     * ========================================================= */
    Page<Category> findByNameContainingIgnoreCase(String keyword, Pageable pageable);
}