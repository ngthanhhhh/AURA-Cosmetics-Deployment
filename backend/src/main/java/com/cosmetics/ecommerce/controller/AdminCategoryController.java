package com.cosmetics.ecommerce.controller;

import com.cosmetics.ecommerce.entity.Category;
import com.cosmetics.ecommerce.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * API quản lý danh mục dành cho quản trị viên.
 *
 * Controller này xử lý các chức năng:
 * xem danh sách danh mục, thêm danh mục,
 * cập nhật danh mục và xóa danh mục.
 */
@RestController
@RequestMapping("/api/v1/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

        private final CategoryService categoryService;

        /**
         * Lấy danh sách danh mục có phân trang và sắp xếp.
         *
         * API dùng cho màn hình quản lý danh mục của admin.
         * Hỗ trợ:
         * - phân trang
         * - sắp xếp theo nhiều tiêu chí
         * - sắp xếp tăng/giảm dần
         *
         * @param page Trang hiện tại.
         * @param size Số lượng danh mục mỗi trang.
         * @param sortBy Tiêu chí sắp xếp.
         * @param direction Hướng sắp xếp: asc hoặc desc.
         * @return Danh sách danh mục dạng phân trang.
         */
                @GetMapping
                public ResponseEntity<Page<Category>> getAll(
                        @RequestParam(required = false) String keyword,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(defaultValue = "categoryId") String sortBy,
                        @RequestParam(defaultValue = "asc") String direction
                ) {
                return ResponseEntity.ok(
                        categoryService.getAll(keyword, page, size, sortBy, direction)
                );
                }

        /**
         * Tạo mới danh mục sản phẩm.
         *
         * Request sẽ được validate trước khi chuyển xuống tầng service.
         * Service chịu trách nhiệm kiểm tra dữ liệu hợp lệ
         * và lưu danh mục mới vào hệ thống.
         *
         * @param category Thông tin danh mục cần tạo.
         * @return Thông tin danh mục vừa được tạo.
         */
        @PostMapping
        public ResponseEntity<Category> create(
                @Valid @RequestBody Category category
        ) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(categoryService.create(category));
        }

        /**
         * Cập nhật thông tin danh mục.
         *
         * API dùng cho admin chỉnh sửa tên
         * hoặc mô tả của danh mục đã tồn tại.
         *
         * @param id ID của danh mục cần cập nhật.
         * @param category Thông tin danh mục mới.
         * @return Thông tin danh mục sau khi cập nhật.
         */
        @PutMapping("/{id}")
        public ResponseEntity<Category> update(
                @PathVariable Integer id,
                @Valid @RequestBody Category category
        ) {
                return ResponseEntity.ok(
                        categoryService.update(id, category)
                );
        }

        /**
         * Xóa danh mục theo ID.
         *
         * Tầng service sẽ xử lý logic kiểm tra:
         * - danh mục có tồn tại hay không
         * - danh mục có đang chứa sản phẩm hay không
         * trước khi thực hiện xóa.
         *
         * @param id ID của danh mục cần xóa.
         * @return Thông báo xóa danh mục thành công.
         */
        @DeleteMapping("/{id}")
        public ResponseEntity<?> delete(@PathVariable Integer id) {

                categoryService.delete(id);

                return ResponseEntity.ok("Xóa danh mục thành công");
        }
}