package com.cosmetics.ecommerce.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cosmetics.ecommerce.entity.Product;
import com.cosmetics.ecommerce.enums.ProductStatus;

/* =========================================================
 * PRODUCT REPOSITORY
 * ---------------------------------------------------------
 * Là tầng truy xuất dữ liệu của bảng products.
 *
 * Chức năng:
 * - Kế thừa JpaRepository để có sẵn các thao tác CRUD cơ bản.
 * - Tìm kiếm sản phẩm theo tên, giá, danh mục và trạng thái.
 * - Hỗ trợ truy vấn sản phẩm công khai cho khách hàng.
 * - Hỗ trợ truy vấn sản phẩm cho khu vực quản trị.
 * - Hỗ trợ sắp xếp sản phẩm theo điểm đánh giá trung bình.
 * ========================================================= */
@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    /* =========================================================
     * TÌM SẢN PHẨM THEO TÊN
     * ---------------------------------------------------------
     * Tìm danh sách sản phẩm có tên chứa chuỗi truyền vào.
     * Không phân biệt chữ hoa/thường.
     * ========================================================= */
    List<Product> findByNameContainingIgnoreCase(String name);

    /* =========================================================
     * TÌM SẢN PHẨM THEO KHOẢNG GIÁ
     * ---------------------------------------------------------
     * Trả về danh sách sản phẩm có giá nằm trong khoảng
     * min - max.
     * ========================================================= */
    List<Product> findByPriceBetween(BigDecimal min, BigDecimal max);

    /* =========================================================
     * TÌM SẢN PHẨM THEO DANH MỤC
     * ---------------------------------------------------------
     * Trả về các sản phẩm thuộc một danh mục cụ thể.
     * ========================================================= */
    List<Product> findByCategory_CategoryId(Integer categoryId);

    /* =========================================================
     * TÌM SẢN PHẨM THEO TRẠNG THÁI
     * ---------------------------------------------------------
     * Trả về danh sách sản phẩm theo trạng thái:
     * - ACTIVE
     * - INACTIVE
     * ========================================================= */
    List<Product> findByStatus(ProductStatus status);

    /* =========================================================
     * TÌM SẢN PHẨM THEO TRẠNG THÁI CÓ PHÂN TRANG
     * ---------------------------------------------------------
     * Dùng khi cần lấy sản phẩm theo trạng thái với Pageable.
     * ========================================================= */
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    /* =========================================================
     * TÌM SẢN PHẨM KÈM KHÓA GHI
     * ---------------------------------------------------------
     * Sử dụng PESSIMISTIC_WRITE để khóa bản ghi sản phẩm
     * khi xử lý các nghiệp vụ cần đảm bảo an toàn dữ liệu,
     * ví dụ cập nhật tồn kho khi đặt hàng.
     * ========================================================= */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.productId = :id")
    Optional<Product> findByIdWithLock(@Param("id") Integer id);

    /* =========================================================
     * TÌM KIẾM/LỌC SẢN PHẨM CÔNG KHAI CHO KHÁCH HÀNG
     * ---------------------------------------------------------
     * Chỉ lấy các sản phẩm có trạng thái ACTIVE.
     *
     * Hỗ trợ:
     * - Tìm kiếm theo tên sản phẩm.
     * - Lọc theo danh mục.
     * - Lọc theo khoảng giá.
     * - Phân trang và sắp xếp thông qua Pageable.
     * ========================================================= */
    @Query("""
        SELECT p FROM Product p
        WHERE p.status = com.cosmetics.ecommerce.enums.ProductStatus.ACTIVE
        AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:categoryId IS NULL OR p.category.categoryId = :categoryId)
        AND (:minPrice IS NULL OR p.price >= :minPrice)
        AND (:maxPrice IS NULL OR p.price <= :maxPrice)
    """)
    Page<Product> searchPublicProducts(
            @Param("keyword") String keyword,
            @Param("categoryId") Integer categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

    /* =========================================================
     * TÌM KIẾM/LỌC SẢN PHẨM CHO QUẢN TRỊ VIÊN
     * ---------------------------------------------------------
     * Dùng trong trang quản lý sản phẩm của admin.
     *
     * Hỗ trợ:
     * - Tìm kiếm theo tên sản phẩm.
     * - Lọc theo danh mục.
     * - Lọc theo khoảng giá.
     * - Lọc theo trạng thái ACTIVE/INACTIVE.
     * - Phân trang và sắp xếp thông qua Pageable.
     * ========================================================= */
    @Query("""
        SELECT p FROM Product p
        WHERE (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:categoryId IS NULL OR p.category.categoryId = :categoryId)
        AND (:minPrice IS NULL OR p.price >= :minPrice)
        AND (:maxPrice IS NULL OR p.price <= :maxPrice)
        AND (:status IS NULL OR p.status = :status)
    """)
    Page<Product> searchAdminProducts(
            @Param("keyword") String keyword,
            @Param("categoryId") Integer categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("status") ProductStatus status,
            Pageable pageable
    );

    /* =========================================================
     * TÌM KIẾM/LỌC SẢN PHẨM VÀ SẮP XẾP THEO ĐÁNH GIÁ
     * ---------------------------------------------------------
     * Chỉ áp dụng cho danh sách sản phẩm công khai của khách hàng.
     *
     * Cách xử lý:
     * - LEFT JOIN bảng Review để lấy dữ liệu đánh giá.
     * - GROUP BY theo sản phẩm.
     * - ORDER BY AVG(r.rating) DESC để sản phẩm có điểm
     *   trung bình cao hơn được hiển thị trước.
     * - NULLS LAST giúp sản phẩm chưa có đánh giá nằm phía sau.
     *
     * countQuery được khai báo riêng để hỗ trợ phân trang
     * đúng khi truy vấn có GROUP BY.
     * ========================================================= */
    @Query(
        value = """
            SELECT p
            FROM Product p
            LEFT JOIN Review r ON r.product = p
            WHERE p.status = com.cosmetics.ecommerce.enums.ProductStatus.ACTIVE
            AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (:categoryId IS NULL OR p.category.categoryId = :categoryId)
            AND (:minPrice IS NULL OR p.price >= :minPrice)
            AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            GROUP BY p
            ORDER BY AVG(r.rating) DESC NULLS LAST
        """,
        countQuery = """
            SELECT COUNT(p)
            FROM Product p
            WHERE p.status = com.cosmetics.ecommerce.enums.ProductStatus.ACTIVE
            AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (:categoryId IS NULL OR p.category.categoryId = :categoryId)
            AND (:minPrice IS NULL OR p.price >= :minPrice)
            AND (:maxPrice IS NULL OR p.price <= :maxPrice)
        """
    )
    Page<Product> searchPublicProductsOrderByRatingDesc(
            @Param("keyword") String keyword,
            @Param("categoryId") Integer categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );
}