package com.cosmetics.ecommerce.controller;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cosmetics.ecommerce.dto.ProductResponse;
import com.cosmetics.ecommerce.service.ProductService;

import lombok.RequiredArgsConstructor;

/* =========================================================
 * PRODUCT API CONTROLLER
 * ---------------------------------------------------------
 * Cung cấp các API công khai liên quan đến sản phẩm cho
 * khách hàng.
 *
 * Các chức năng chính:
 * - Xem danh sách sản phẩm đang kinh doanh (ACTIVE).
 * - Tìm kiếm và lọc sản phẩm theo nhiều tiêu chí.
 * - Phân trang và sắp xếp danh sách sản phẩm.
 * - Xem thông tin chi tiết sản phẩm.
 * ========================================================= */
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    /* =========================================================
     * SERVICE XỬ LÝ NGHIỆP VỤ SẢN PHẨM
     * ---------------------------------------------------------
     * Controller chỉ tiếp nhận request từ client và chuyển
     * xử lý xuống tầng Service.
     * ========================================================= */
    private final ProductService productService;

    /* =========================================================
     * API LẤY DANH SÁCH SẢN PHẨM
     * ---------------------------------------------------------
     * Hỗ trợ:
     * - Tìm kiếm theo tên sản phẩm (keyword)
     * - Lọc theo danh mục (categoryId)
     * - Lọc theo khoảng giá (minPrice - maxPrice)
     * - Phân trang dữ liệu (page, size)
     * - Sắp xếp theo thuộc tính bất kỳ (sortBy)
     * - Chọn thứ tự tăng/giảm (direction)
     *
     * Chỉ trả về các sản phẩm đang hoạt động và hiển thị
     * công khai cho khách hàng.
     * Kết quả trả về dưới dạng Page<ProductResponse>.
     * ========================================================= */
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "productId") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        return ResponseEntity.ok(
                productService.getPublicProducts(
                        keyword,
                        categoryId,
                        minPrice,
                        maxPrice,
                        page,
                        size,
                        sortBy,
                        direction
                )
        );
    }

    /* =========================================================
     * API XEM CHI TIẾT SẢN PHẨM
     * ---------------------------------------------------------
     * Nhận ID sản phẩm từ URL.
     * Trả về đầy đủ thông tin sản phẩm phục vụ trang chi tiết:
     * - Thông tin cơ bản
     * - Giá bán
     * - Hình ảnh
     * - Danh mục
     * - Điểm đánh giá trung bình
     * - Số lượng đánh giá
     *
     * Nếu sản phẩm không tồn tại sẽ được xử lý tại tầng Service.
     * ========================================================= */
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getPublicProductDetail(id));
    }
}