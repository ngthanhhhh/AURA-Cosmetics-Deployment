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

public interface ReviewRepository extends JpaRepository<Review, Integer>{
    List<Review> findByProduct_ProductIdOrderByCreatedAtDesc(Integer productId);

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

    @Query("""
            SELECT AVG(r.rating)
            FROM Review r
            WHERE r.product.productId = :productId
            """)
    Double calculateAverageRatingByProductId(@Param("productId") Integer productId);

    Long countByProduct_ProductId(Integer productId);
}
