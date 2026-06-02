package com.cosmetics.ecommerce.service.impl;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.cosmetics.ecommerce.dto.ProductRequest;
import com.cosmetics.ecommerce.dto.ProductResponse;
import com.cosmetics.ecommerce.entity.Category;
import com.cosmetics.ecommerce.entity.Product;
import com.cosmetics.ecommerce.enums.ProductStatus;
import com.cosmetics.ecommerce.exception.BadRequestException;
import com.cosmetics.ecommerce.exception.ResourceNotFoundException;
import com.cosmetics.ecommerce.repository.CategoryRepository;
import com.cosmetics.ecommerce.repository.ProductRepository;
import com.cosmetics.ecommerce.service.ProductService;

import com.cosmetics.ecommerce.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;

/* =========================================================
 * PRODUCT SERVICE IMPLEMENTATION
 * ---------------------------------------------------------
 * Triển khai các nghiệp vụ liên quan đến sản phẩm.
 *
 * Chức năng chính:
 * - Lấy danh sách sản phẩm công khai cho khách hàng.
 * - Lấy danh sách sản phẩm cho quản trị viên.
 * - Tìm kiếm, lọc, phân trang và sắp xếp sản phẩm.
 * - Xem chi tiết sản phẩm.
 * - Thêm mới, cập nhật và xóa mềm sản phẩm.
 * - Ánh xạ dữ liệu Product entity sang ProductResponse DTO.
 * - Tính điểm đánh giá trung bình và số lượng đánh giá.
 * ========================================================= */
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    /* =========================================================
     * REPOSITORY TRUY XUẤT DỮ LIỆU
     * ---------------------------------------------------------
     * productRepository  : Làm việc với bảng products.
     * categoryRepository : Kiểm tra và truy xuất danh mục.
     * reviewRepository   : Lấy dữ liệu đánh giá của sản phẩm.
     * ========================================================= */
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;

    /* =========================================================
     * TẠO ĐỐI TƯỢNG PHÂN TRANG VÀ SẮP XẾP
     * ---------------------------------------------------------
     * Hàm dùng chung cho các API lấy danh sách sản phẩm.
     *
     * Xử lý:
     * - Kiểm tra số trang hợp lệ.
     * - Kiểm tra kích thước trang hợp lệ.
     * - Thiết lập trường sắp xếp mặc định nếu không truyền vào.
     * - Tạo Sort theo hướng tăng dần hoặc giảm dần.
     * - Trả về Pageable để Repository sử dụng khi truy vấn.
     * ========================================================= */
    private Pageable buildPageable(int page, int size, String sortBy, String direction) {
        if (page < 0) {
            throw new BadRequestException("Số trang không hợp lệ");
        }

        if (size <= 0) {
            throw new BadRequestException("Kích thước trang không hợp lệ");
        }

        if (sortBy == null || sortBy.trim().isEmpty()) {
            sortBy = "productId";
        }

        Sort sort = "desc".equalsIgnoreCase(direction)
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        return PageRequest.of(page, size, sort);
    }

    /* =========================================================
     * KIỂM TRA KHOẢNG GIÁ
     * ---------------------------------------------------------
     * Được dùng khi tìm kiếm/lọc sản phẩm theo khoảng giá.
     *
     * Điều kiện hợp lệ:
     * - Giá thấp nhất không được âm.
     * - Giá cao nhất không được âm.
     * - Giá thấp nhất không được lớn hơn giá cao nhất.
     * ========================================================= */
    private void validatePriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        if (minPrice != null && minPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Giá thấp nhất không được âm");
        }

        if (maxPrice != null && maxPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Giá cao nhất không được âm");
        }

        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            throw new BadRequestException("Khoảng giá không hợp lệ");
        }
    }

    /* =========================================================
     * KIỂM TRA DANH MỤC TỒN TẠI
     * ---------------------------------------------------------
     * Nếu người dùng lọc sản phẩm theo categoryId thì hệ thống
     * cần kiểm tra danh mục đó có tồn tại trong database hay không.
     * ========================================================= */
    private void validateCategoryExists(Integer categoryId) {
        if (categoryId != null && !categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Danh mục không tồn tại");
        }
    }

    /* =========================================================
     * KIỂM TRA DỮ LIỆU SẢN PHẨM
     * ---------------------------------------------------------
     * Dùng chung cho thêm mới và cập nhật sản phẩm.
     *
     * Điều kiện hợp lệ:
     * - Request không được null.
     * - Tên sản phẩm không được để trống.
     * - Giá sản phẩm phải lớn hơn 0.
     * - Số lượng tồn kho không được âm.
     * - Sản phẩm phải thuộc một danh mục hợp lệ.
     * ========================================================= */
    private void validateProductRequest(ProductRequest request) {
        if (request == null) {
            throw new BadRequestException("Dữ liệu sản phẩm không hợp lệ");
        }

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new BadRequestException("Tên sản phẩm không được để trống");
        }

        if (request.getPrice() == null || request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Giá sản phẩm phải lớn hơn 0");
        }

        if (request.getStock() == null || request.getStock() < 0) {
            throw new BadRequestException("Số lượng tồn kho không được âm");
        }

        if (request.getCategoryId() == null) {
            throw new BadRequestException("Danh mục sản phẩm không được để trống");
        }
    }

    /* =========================================================
     * CHUYỂN PRODUCT ENTITY SANG PRODUCT RESPONSE DTO
     * ---------------------------------------------------------
     * Hàm này giúp tách dữ liệu trả về cho frontend khỏi entity.
     *
     * Dữ liệu trả về gồm:
     * - Thông tin cơ bản của sản phẩm.
     * - Tên danh mục.
     * - Trạng thái sản phẩm.
     * - Điểm đánh giá trung bình.
     * - Số lượng đánh giá.
     * ========================================================= */
    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = new ProductResponse();

        response.setProductId(product.getProductId());
        response.setName(product.getName());
        response.setPrice(product.getPrice());
        response.setStock(product.getStock());
        response.setDescription(product.getDescription());
        response.setImage(product.getImage());

        if (product.getCategory() != null) {
            response.setCategoryName(product.getCategory().getName());
        }

        if (product.getStatus() != null) {
            response.setStatus(product.getStatus().name());
        }

        Double averageRating = reviewRepository.calculateAverageRatingByProductId(
        product.getProductId()
        );

        Long reviewCount = reviewRepository.countByProduct_ProductId(
                product.getProductId()
        );

        response.setAverageRating(averageRating == null ? 0.0 : averageRating);
        response.setReviewCount(reviewCount == null ? 0L : reviewCount);

        return response;
    }

    /* =========================================================
     * CHUYỂN CHUỖI TRẠNG THÁI SANG ENUM PRODUCT STATUS
     * ---------------------------------------------------------
     * Dùng khi thêm hoặc cập nhật sản phẩm.
     *
     * Nếu không truyền trạng thái, mặc định sản phẩm là ACTIVE.
     * Nếu trạng thái truyền vào không hợp lệ, hệ thống trả lỗi.
     * ========================================================= */
    private ProductStatus parseStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            return ProductStatus.ACTIVE;
        }

        try {
            return ProductStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Trạng thái sản phẩm không hợp lệ");
        }
    }

    /* =========================================================
     * LẤY DANH SÁCH SẢN PHẨM CÔNG KHAI CHO KHÁCH HÀNG
     * ---------------------------------------------------------
     * Chức năng:
     * - Tìm kiếm theo từ khóa.
     * - Lọc theo danh mục.
     * - Lọc theo khoảng giá.
     * - Phân trang.
     * - Sắp xếp sản phẩm.
     *
     * Khách hàng chỉ nhìn thấy sản phẩm có trạng thái ACTIVE.
     * Nếu sortBy là averageRating thì hệ thống dùng truy vấn
     * riêng để sắp xếp theo điểm đánh giá trung bình.
     * ========================================================= */
    @Override
    public Page<ProductResponse> getPublicProducts(
            String keyword,
            Integer categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            int page,
            int size,
            String sortBy,
            String direction
    ) {
        validatePriceRange(minPrice, maxPrice);
        validateCategoryExists(categoryId);

        if ("averageRating".equalsIgnoreCase(sortBy)) {
            Pageable pageable = PageRequest.of(page, size);

            return productRepository.searchPublicProductsOrderByRatingDesc(
                    keyword,
                    categoryId,
                    minPrice,
                    maxPrice,
                    pageable
            ).map(this::mapToResponse);
        }

        Pageable pageable = buildPageable(page, size, sortBy, direction);

        return productRepository.searchPublicProducts(
                keyword,
                categoryId,
                minPrice,
                maxPrice,
                pageable
        ).map(this::mapToResponse);
    }

    /* =========================================================
     * LẤY CHI TIẾT SẢN PHẨM CÔNG KHAI
     * ---------------------------------------------------------
     * Dùng cho trang chi tiết sản phẩm phía khách hàng.
     * Hệ thống lấy Product theo ID, sau đó chuyển sang DTO
     * để trả về frontend.
     * ========================================================= */
    @Override
    public ProductResponse getPublicProductDetail(Integer id) {
        return mapToResponse(getById(id));
    }

    /* =========================================================
     * LẤY DANH SÁCH SẢN PHẨM CHO QUẢN TRỊ VIÊN
     * ---------------------------------------------------------
     * Chức năng:
     * - Tìm kiếm theo từ khóa.
     * - Lọc theo danh mục.
     * - Lọc theo khoảng giá.
     * - Lọc theo trạng thái ACTIVE/INACTIVE.
     * - Phân trang và sắp xếp.
     *
     * Khác với khách hàng, admin có thể xem cả sản phẩm đang
     * kinh doanh và sản phẩm đã ngừng kinh doanh.
     * ========================================================= */
    @Override
    public Page<ProductResponse> getAdminProducts(
            String keyword,
            Integer categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            ProductStatus status,
            int page,
            int size,
            String sortBy,
            String direction
    ) {
        validatePriceRange(minPrice, maxPrice);
        validateCategoryExists(categoryId);

        Pageable pageable = buildPageable(page, size, sortBy, direction);

        return productRepository.searchAdminProducts(
                keyword,
                categoryId,
                minPrice,
                maxPrice,
                status,
                pageable
        ).map(this::mapToResponse);
    }

    /* =========================================================
     * LẤY PRODUCT ENTITY THEO ID
     * ---------------------------------------------------------
     * Dùng trong các nghiệp vụ cần thao tác trực tiếp với entity.
     * Nếu không tìm thấy sản phẩm, hệ thống trả lỗi không tồn tại.
     * ========================================================= */
    @Override
    public Product getById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại"));
    }

    /* =========================================================
     * THÊM SẢN PHẨM MỚI
     * ---------------------------------------------------------
     * Quy trình:
     * - Kiểm tra dữ liệu sản phẩm hợp lệ.
     * - Kiểm tra danh mục tồn tại.
     * - Tạo đối tượng Product mới.
     * - Chuẩn hóa tên và đường dẫn ảnh.
     * - Gán danh mục và trạng thái sản phẩm.
     * - Lưu sản phẩm vào database.
     * - Trả về ProductResponse cho frontend.
     * ========================================================= */
    @Override
    public ProductResponse create(ProductRequest request) {
        validateProductRequest(request);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tồn tại"));

        Product product = new Product();
        product.setName(request.getName().trim());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setDescription(request.getDescription());
        product.setImage(normalizeImagePath(request.getImage()));
        product.setCategory(category);
        product.setStatus(parseStatus(request.getStatus()));

        Product saved = productRepository.save(product);

        return mapToResponse(saved);
    }

    /* =========================================================
     * CẬP NHẬT SẢN PHẨM
     * ---------------------------------------------------------
     * Quy trình:
     * - Kiểm tra dữ liệu cập nhật hợp lệ.
     * - Tìm sản phẩm cũ theo ID.
     * - Kiểm tra danh mục mới tồn tại.
     * - Cập nhật thông tin sản phẩm.
     * - Chuẩn hóa lại đường dẫn ảnh.
     * - Cập nhật trạng thái nếu có truyền vào.
     * - Lưu thay đổi vào database.
     * ========================================================= */
    @Override
    public ProductResponse update(Integer id, ProductRequest request) {
        validateProductRequest(request);

        Product old = getById(id);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tồn tại"));

        old.setName(request.getName().trim());
        old.setPrice(request.getPrice());
        old.setStock(request.getStock());
        old.setDescription(request.getDescription());
        old.setImage(normalizeImagePath(request.getImage()));
        old.setCategory(category);

        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            old.setStatus(parseStatus(request.getStatus()));
        }

        Product updated = productRepository.save(old);

        return mapToResponse(updated);
    }

    /* =========================================================
     * XÓA MỀM SẢN PHẨM
     * ---------------------------------------------------------
     * Không xóa sản phẩm khỏi database.
     * Hệ thống chỉ chuyển trạng thái sản phẩm sang INACTIVE.
     *
     * Cách này giúp bảo toàn dữ liệu lịch sử đơn hàng và
     * tránh làm mất thông tin sản phẩm đã từng được mua.
     * ========================================================= */
    @Override
    public void delete(Integer id) {
        Product product = getById(id);
        product.setStatus(ProductStatus.INACTIVE);
        productRepository.save(product);
    }

    /* =========================================================
     * CHUẨN HÓA ĐƯỜNG DẪN ẢNH SẢN PHẨM
     * ---------------------------------------------------------
     * Xử lý các trường hợp:
     * - Ảnh rỗng hoặc null thì trả về null.
     * - Nếu là URL đầy đủ hoặc đã bắt đầu bằng /uploads/ thì giữ nguyên.
     * - Nếu bắt đầu bằng uploads/ thì thêm dấu / phía trước.
     * - Nếu chỉ là tên file thì tự thêm đường dẫn /uploads/products/.
     *
     * Hiện tại hệ thống có thể lưu URL Cloudinary đầy đủ,
     * nên các đường dẫn bắt đầu bằng http sẽ được giữ nguyên.
     * ========================================================= */
    private String normalizeImagePath(String image) {
        if (image == null || image.trim().isEmpty()) {
            return null;
        }

        String trimmed = image.trim();

        if (trimmed.startsWith("http") || trimmed.startsWith("/uploads/")) {
            return trimmed;
        }

        if (trimmed.startsWith("uploads/")) {
            return "/" + trimmed;
        }

        return "/uploads/products/" + trimmed;
    }
}