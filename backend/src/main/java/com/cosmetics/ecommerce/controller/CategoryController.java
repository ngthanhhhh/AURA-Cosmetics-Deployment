package com.cosmetics.ecommerce.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cosmetics.ecommerce.entity.Category;
import com.cosmetics.ecommerce.service.CategoryService;

import lombok.RequiredArgsConstructor;

/* =========================================================
 * CATEGORY API CONTROLLER
 * ---------------------------------------------------------
 * Cung cấp các API công khai liên quan đến danh mục sản phẩm.
 * Các chức năng chính:
 * - Lấy danh sách danh mục có hỗ trợ tìm kiếm, phân trang,
 *   sắp xếp dữ liệu.
 * - Xem thông tin chi tiết một danh mục theo ID.
 * ========================================================= */
@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    /* =========================================================
     * SERVICE XỬ LÝ NGHIỆP VỤ DANH MỤC
     * ---------------------------------------------------------
     * Controller chỉ tiếp nhận request từ client và chuyển
     * việc xử lý xuống tầng Service.
     * ========================================================= */
    private final CategoryService categoryService;

    /* =========================================================
     * API LẤY DANH SÁCH DANH MỤC
     * ---------------------------------------------------------
     * Hỗ trợ:
     * - Tìm kiếm theo từ khóa (keyword)
     * - Phân trang (page, size)
     * - Sắp xếp theo thuộc tính bất kỳ (sortBy)
     * - Chọn thứ tự tăng/giảm (direction)
     *
     * Kết quả trả về dưới dạng Page<Category>.
     * ========================================================= */
    @GetMapping
    public ResponseEntity<Page<Category>> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "categoryId") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        return ResponseEntity.ok(
                categoryService.getAll(
                        keyword,
                        page,
                        size,
                        sortBy,
                        direction
                )
        );
    }

    /* =========================================================
     * API XEM CHI TIẾT DANH MỤC
     * ---------------------------------------------------------
     * Nhận ID danh mục từ URL.
     * Trả về thông tin chi tiết của danh mục tương ứng.
     * Nếu không tồn tại sẽ được xử lý ở tầng Service.
     * ========================================================= */
    @GetMapping("/{id}")
    public ResponseEntity<Category> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(categoryService.getById(id));
    }
}