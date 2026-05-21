package com.cosmetics.ecommerce.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.cosmetics.ecommerce.dto.ProductRequest;
import com.cosmetics.ecommerce.dto.ProductResponse;
import com.cosmetics.ecommerce.enums.ProductStatus;
import com.cosmetics.ecommerce.service.ProductService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Map;

/**
 * API quản lý sản phẩm dành cho quản trị viên.
 *
 * Controller này xử lý các chức năng:
 * - xem danh sách sản phẩm
 * - tìm kiếm/lọc/sắp xếp sản phẩm
 * - thêm sản phẩm
 * - cập nhật sản phẩm
 * - xóa sản phẩm
 * - upload hình ảnh sản phẩm lên Cloudinary
 */
@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    /**
     * Service xử lý nghiệp vụ sản phẩm.
     */
    private final ProductService productService;

    /**
     * Cloudinary dùng để upload và quản lý ảnh sản phẩm.
     */
    private final Cloudinary cloudinary;

    /**
     * Lấy danh sách sản phẩm dành cho admin.
     *
     * API này hỗ trợ:
     * - tìm kiếm theo từ khóa
     * - lọc theo danh mục
     * - lọc theo khoảng giá
     * - lọc theo trạng thái
     * - phân trang
     * - sắp xếp tăng/giảm dần
     *
     * @param keyword Từ khóa tìm kiếm sản phẩm.
     * @param categoryId ID danh mục cần lọc.
     * @param minPrice Giá nhỏ nhất cần lọc.
     * @param maxPrice Giá lớn nhất cần lọc.
     * @param status Trạng thái sản phẩm cần lọc.
     * @param page Trang hiện tại.
     * @param size Số sản phẩm mỗi trang.
     * @param sortBy Tiêu chí sắp xếp.
     * @param direction Hướng sắp xếp: asc hoặc desc.
     * @return Danh sách sản phẩm dạng phân trang.
     */
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getProductsForAdmin(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) ProductStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "productId") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {

        return ResponseEntity.ok(
                productService.getAdminProducts(
                        keyword,
                        categoryId,
                        minPrice,
                        maxPrice,
                        status,
                        page,
                        size,
                        sortBy,
                        direction
                )
        );
    }

    /**
     * Tạo mới sản phẩm.
     *
     * Request sẽ được validate trước khi chuyển xuống tầng service.
     * Service chịu trách nhiệm kiểm tra dữ liệu hợp lệ,
     * kiểm tra danh mục và lưu sản phẩm mới vào hệ thống.
     *
     * @param request Thông tin sản phẩm cần tạo.
     * @return Thông tin sản phẩm vừa được tạo.
     */
    @PostMapping
    public ResponseEntity<ProductResponse> create(
            @Valid @RequestBody ProductRequest request
    ) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.create(request));
    }

    /**
     * Cập nhật thông tin sản phẩm.
     *
     * API dùng cho admin chỉnh sửa:
     * - tên sản phẩm
     * - giá
     * - tồn kho
     * - mô tả
     * - hình ảnh
     * - danh mục
     * - trạng thái sản phẩm
     *
     * @param id ID sản phẩm cần cập nhật.
     * @param request Thông tin sản phẩm mới.
     * @return Thông tin sản phẩm sau khi cập nhật.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody ProductRequest request
    ) {

        return ResponseEntity.ok(
                productService.update(id, request)
        );
    }

    /**
     * Xóa sản phẩm theo ID.
     *
     * Service sẽ xử lý logic xóa sản phẩm.
     *
     * @param id ID sản phẩm cần xóa.
     * @return Thông báo xóa thành công.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {

        productService.delete(id);

        return ResponseEntity.ok(
                "Xóa sản phẩm thành công"
        );
    }

    /**
     * Upload hình ảnh sản phẩm lên Cloudinary.
     *
     * Flow xử lý:
     * 1. Kiểm tra file có rỗng hay không.
     * 2. Kiểm tra file upload có phải ảnh hay không.
     * 3. Upload ảnh lên Cloudinary.
     * 4. Lấy URL ảnh từ Cloudinary.
     * 5. Trả URL về frontend để lưu vào sản phẩm.
     *
     * @param file File ảnh sản phẩm từ frontend.
     * @return URL ảnh sau khi upload thành công.
     */
    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file
    ) {

        try {

            /**
             * Kiểm tra file upload có rỗng hay không.
             */
            if (file.isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "File ảnh không được để trống"
                        ));
            }

            String contentType = file.getContentType();

            /**
             * Chỉ cho phép upload file ảnh.
             */
            if (contentType == null
                    || !contentType.startsWith("image/")) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "Chỉ được upload file ảnh"
                        ));
            }

            /**
             * Upload ảnh lên Cloudinary.
             */
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "aura/products",
                            "resource_type", "image"
                    )
            );

            /**
             * Lấy URL ảnh trả về từ Cloudinary.
             */
            String imageUrl =
                    uploadResult.get("secure_url").toString();

            return ResponseEntity.ok(
                    Map.of("imageUrl", imageUrl)
            );

        } catch (IOException e) {

            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "message",
                            "Upload ảnh thất bại"
                    ));
        }
    }
}