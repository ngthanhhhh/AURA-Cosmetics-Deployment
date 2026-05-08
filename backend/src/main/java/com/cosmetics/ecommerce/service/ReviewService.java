package com.cosmetics.ecommerce.service;

import org.springframework.data.domain.Page;

import com.cosmetics.ecommerce.dto.ProductReviewListResponseDTO;
import com.cosmetics.ecommerce.dto.ReviewReportDTO;
import com.cosmetics.ecommerce.dto.ReviewRequestDTO;
import com.cosmetics.ecommerce.dto.ReviewResponseDTO;

public interface ReviewService {
    ReviewResponseDTO createReview(Integer userId, Integer productId, ReviewRequestDTO request);
    
    ProductReviewListResponseDTO getProductReviews(
        Integer productId, 
        Integer rating,
        Boolean verified,
        String keyword,
        int page,
        int size,
        String sortBy,
        String sortDir
    );
    
    Page<ReviewResponseDTO> getAllReviewsForAdmin(
        Integer rating,
        String flag,
        Boolean verified,
        Integer productId,
        String keyword,
        int page,
        int size,
        String sortBy,
        String sortDir
    );

    ReviewResponseDTO updateReviewFlag(Integer reviewId, String flag);
    
    Page<ReviewReportDTO> getReviewReport(
        String keyword,
        Double minAverageRating,
        int page,
        int size,
        String sortBy,
        String sortDir
    );
}
