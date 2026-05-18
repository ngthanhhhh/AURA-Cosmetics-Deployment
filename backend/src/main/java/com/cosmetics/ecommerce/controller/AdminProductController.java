package com.cosmetics.ecommerce.controller;

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
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

/**
 * API quản lý sản phẩm dành cho quản trị viên.
 *
 * Controller này xử lý các chức năng:
 * xem danh sách sản phẩm, tìm kiếm/lọc/sắp xếp sản phẩm,
 * thêm sản phẩm, cập nhật sản phẩm, xóa sản phẩm
 * và upload hình ảnh sản phẩm.
 */
@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;

    /**
     * Lấy danh sách sản phẩm dành cho admin.
     *
     * API này hỗ trợ:
     * tìm kiếm theo từ khóa, lọc theo danh mục,
     * lọc theo khoảng giá, lọc theo trạng thái,
     * phân trang và sắp xếp.
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
     * Service chịu trách nhiệm kiểm tra danh mục, xử lý dữ liệu
     * và lưu sản phẩm mới vào hệ thống.
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
     * API dùng cho admin chỉnh sửa thông tin sản phẩm đã tồn tại,
     * bao gồm tên, giá, tồn kho, mô tả, hình ảnh, danh mục và trạng thái.
     *
     * @param id ID của sản phẩm cần cập nhật.
     * @param request Thông tin sản phẩm mới.
     * @return Thông tin sản phẩm sau khi cập nhật.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody ProductRequest request
    ) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    /**
     * Xóa sản phẩm theo ID.
     *
     * Tùy theo logic ở tầng service, thao tác này có thể là xóa mềm
     * hoặc xóa trực tiếp khỏi cơ sở dữ liệu.
     *
     * @param id ID của sản phẩm cần xóa.
     * @return Thông báo xóa sản phẩm thành công.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        productService.delete(id);
        return ResponseEntity.ok("Xóa sản phẩm thành công");
    }

    /**
     * Upload hình ảnh sản phẩm.
     *
     * Flow xử lý:
     * 1. Kiểm tra file có rỗng hay không.
     * 2. Kiểm tra file upload có phải ảnh hay không.
     * 3. Tạo tên file ngẫu nhiên bằng UUID để tránh trùng tên.
     * 4. Tạo thư mục upload nếu chưa tồn tại.
     * 5. Lưu file vào thư mục uploads/products.
     * 6. Trả về đường dẫn ảnh để frontend lưu vào thông tin sản phẩm.
     *
     * @param file File ảnh sản phẩm được gửi từ frontend.
     * @return Đường dẫn ảnh sau khi upload thành công.
     */
    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Kiểm tra file upload có tồn tại nội dung hay không.
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "File ảnh không được để trống"));
            }

            String contentType = file.getContentType();

            // Chỉ cho phép upload các file có content type là image.
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Chỉ được upload file ảnh"));
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";

            // Lấy phần mở rộng của file gốc, ví dụ: .jpg, .png, .webp.
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            // Tạo tên file mới bằng UUID để tránh trùng tên file giữa các sản phẩm.
            String fileName = UUID.randomUUID().toString() + extension;

            Path uploadPath = Paths.get("uploads/products");

            // Tạo thư mục lưu ảnh nếu thư mục chưa tồn tại.
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);

            // Lưu file ảnh vào thư mục upload.
            Files.copy(file.getInputStream(), filePath);

            String imageUrl = "/uploads/products/" + fileName;

            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Upload ảnh thất bại"));
        }
    }
}