package com.cosmetics.ecommerce.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cosmetics.ecommerce.dto.ReviewReportDTO;
import com.cosmetics.ecommerce.entity.Review;
import com.cosmetics.ecommerce.enums.ReviewAdminFlag;

/**
 * Repository thao tác với dữ liệu Review trong database.
 */
public interface ReviewRepository extends JpaRepository<Review, Integer>{
    /**
     * Lấy danh sách đánh giá của một sản phẩm,
     * sắp xếp theo thời gian tạo mới nhất trước.
     *
     * @param productId ID sản phẩm
     * @return Danh sách đánh giá của sản phẩm
     */
    List<Review> findByProduct_ProductIdOrderByCreatedAtDesc(Integer productId);


    /**
     * Lấy báo cáo tổng hợp đánh giá theo từng sản phẩm.
     *
     * Báo cáo gồm:
     * - ID sản phẩm
     * - Tên sản phẩm
     * - Tổng số đánh giá
     * - Điểm đánh giá trung bình
     * - Tỷ lệ hài lòng
     *
     * @return Danh sách báo cáo đánh giá theo sản phẩm
     */
    //constructor expression trong JPQL
    @Query("""
            SELECT new com.cosmetics.ecommerce.dto.ReviewReportDTO(
                p.productId,
                p.name,
                COUNT(r.reviewId),
                AVG(r.rating),
                (AVG(r.rating) / 5.0) * 100
            )
            FROM Review r
            JOIN r.product p
            GROUP BY p.productId, p.name
            ORDER BY AVG(r.rating) DESC
            """)
    List<ReviewReportDTO> getReviewReport();

    /**
     * Tìm kiếm danh sách đánh giá của một sản phẩm.
     *
     * Hỗ trợ:
     * - Lọc theo số sao
     * - Lọc theo trạng thái verified purchase
     * - Tìm kiếm theo nội dung bình luận
     * - Phân trang và sắp xếp thông qua Pageable
     *
     * @param productId ID sản phẩm
     * @param rating    Số sao cần lọc, có thể null
     * @param verified  Trạng thái verified purchase cần lọc, có thể null
     * @param keyword   Từ khóa tìm kiếm trong bình luận, có thể null
     * @param pageable  Thông tin phân trang và sắp xếp
     * @return Page chứa danh sách đánh giá của sản phẩm
     */
    @Query("""
            SELECT r
            FROM Review r
            WHERE r.product.productId = :productId
            AND (:rating IS NULL OR r.rating = :rating)
            AND (:verified IS NULL OR r.isVerifiedPurchase = :verified)
            AND (
                :keyword IS NULL
                OR LOWER(r.comment) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
            """)
    Page<Review> searchProductReviews(
        @Param("productId") Integer productId,
        @Param("rating") Integer rating,
        @Param("verified") Boolean verified,
        @Param("keyword") String keyword,
        Pageable pageable
    );

    /**
     * Tìm kiếm danh sách đánh giá dành cho Admin.
     *
     * Hỗ trợ:
     * - Lọc theo số sao
     * - Lọc theo trạng thái kiểm duyệt
     * - Lọc theo trạng thái verified purchase
     * - Lọc theo sản phẩm
     * - Tìm kiếm theo nội dung bình luận, tên sản phẩm hoặc tên người dùng
     * - Phân trang và sắp xếp thông qua Pageable
     *
     * @param rating    Số sao cần lọc, có thể null
     * @param flag      Trạng thái kiểm duyệt cần lọc, có thể null
     * @param verified  Trạng thái verified purchase cần lọc, có thể null
     * @param productId ID sản phẩm cần lọc, có thể null
     * @param keyword   Từ khóa tìm kiếm, có thể null
     * @param pageable  Thông tin phân trang và sắp xếp
     * @return Page chứa danh sách đánh giá dành cho Admin
     */
    @Query("""
            SELECT r
            FROM Review r
            JOIN r.product p
            JOIN r.user u
            WHERE (:rating IS NULL OR r.rating = :rating)
            AND (:flag IS NULL OR r.adminFlag = :flag)
            AND (:verified IS NULL OR r.isVerifiedPurchase = :verified)
            AND (:productId IS NULL OR p.productId = :productId)
            AND (
                :keyword IS NULL
                OR LOWER(r.comment) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
            """)
    Page<Review> searchAdminReviews(
        @Param("rating") Integer rating,
        @Param("flag") ReviewAdminFlag flag,
        @Param("verified") Boolean verified,
        @Param("productId") Integer productId,
        @Param("keyword") String keyword,
        Pageable pageble
    );

    /**
     * Tìm kiếm báo cáo tổng hợp đánh giá theo sản phẩm.
     *
     * Hỗ trợ:
     * - Tìm kiếm theo tên sản phẩm
     * - Lọc theo điểm đánh giá trung bình tối thiểu
     *
     * @param keyword          Từ khóa tìm kiếm theo tên sản phẩm, có thể null
     * @param minAverageRating Điểm đánh giá trung bình tối thiểu, có thể null
     * @return Danh sách báo cáo đánh giá theo sản phẩm
     */
    @Query("""
            SELECT new com.cosmetics.ecommerce.dto.ReviewReportDTO(
                p.productId,
                p.name,
                COUNT(r.reviewId),
                AVG(r.rating),
                (AVG(r.rating) / 5.0) * 100
            )
            FROM Review r
            JOIN r.product p
            WHERE (
                :keyword IS NULL
                OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
            GROUP BY p.productId, p.name
            HAVING (:minAverageRating IS NULL OR AVG(r.rating) >= :minAverageRating)
            """)
    List<ReviewReportDTO> searchReviewReport(
        @Param("keyword") String keyword,
        @Param("minAverageRating") Double minAverageRating
    );

    /**
     * Tính điểm đánh giá trung bình của một sản phẩm.
     *
     * @param productId ID sản phẩm
     * @return Điểm đánh giá trung bình của sản phẩm
     */
    @Query("""
            SELECT AVG(r.rating)
            FROM Review r
            WHERE r.product.productId = :productId
            """)
    Double calculateAverageRatingByProductId(@Param("productId") Integer productId);

    /**
     * Đếm tổng số đánh giá của một sản phẩm.
     *
     * @param productId ID sản phẩm
     * @return Tổng số đánh giá của sản phẩm
     */
    Long countByProduct_ProductId(Integer productId);
}
