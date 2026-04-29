package com.cosmetics.ecommerce.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cosmetics.ecommerce.dto.ProductReviewListResponseDTO;
import com.cosmetics.ecommerce.dto.ReviewReportDTO;
import com.cosmetics.ecommerce.dto.ReviewRequestDTO;
import com.cosmetics.ecommerce.dto.ReviewResponseDTO;
import com.cosmetics.ecommerce.entity.Product;
import com.cosmetics.ecommerce.entity.Review;
import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.enums.OrderStatus;
import com.cosmetics.ecommerce.enums.ReviewAdminFlag;
import com.cosmetics.ecommerce.exception.BadRequestException;
import com.cosmetics.ecommerce.exception.ResourceNotFoundException;
import com.cosmetics.ecommerce.repository.OrderItemRepository;
import com.cosmetics.ecommerce.repository.ProductRepository;
import com.cosmetics.ecommerce.repository.ReviewRepository;
import com.cosmetics.ecommerce.repository.UserRepository;
import com.cosmetics.ecommerce.service.ReviewService;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService{
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    @Transactional
    public ReviewResponseDTO createReview(Integer userId, Integer productId, ReviewRequestDTO request) {
        validateReviewRequest(request);

        User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại!"));
        Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại!"));

        boolean isVerifiedPurchase = orderItemRepository.existsByOrder_User_UserIdAndProduct_ProductIdAndOrder_Status(
            userId, productId, OrderStatus.COMPLETED
        );

        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setIsVerifiedPurchase(isVerifiedPurchase);
        review.setAdminFlag(ReviewAdminFlag.NORMAL);

        Review savedReview = reviewRepository.save(review);

        return mapToResponse(savedReview);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductReviewListResponseDTO getProductReviews(Integer productId, Integer rating) {
        Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại!"));

        if (rating != null && (rating < 1 || rating > 5)) {
            throw new BadRequestException("Số sao lọc phải nằm trong khoảng từ 1 đến 5");
        }

        // Lấy tất cả review để tính điểm trung bình đúng theo toàn bộ sản phẩm
        List<Review> allReviews = reviewRepository.findByProduct_ProductIdOrderByCreatedAtDesc(productId);

        // Danh sách hiển thị thì mới áp dụng filter
        List<Review> displayedReviews = rating == null
                ? allReviews
                : reviewRepository.findByProduct_ProductIdAndRatingOrderByCreatedAtDesc(productId, rating);

        double averageRating = allReviews.isEmpty()
                ? 0.0
                : allReviews.stream()
                        .mapToInt(Review::getRating)
                        .average()
                        .orElse(0.0);

        List<ReviewResponseDTO> reviewResponses = displayedReviews.stream()
            .map(this::mapToResponse)
            .toList();

        return ProductReviewListResponseDTO.builder()
            .productId(product.getProductId())
            .productName(product.getName())
            .averageRating(averageRating)
            .totalReviews(allReviews.size())
            .reviews(reviewResponses)
            .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponseDTO> getAllReviewsForAdmin() {
        return reviewRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(this::mapToResponse)
            .toList();
    }

    @Override
    @Transactional
    public ReviewResponseDTO updateReviewFlag(Integer reviewId, String flag) {
        if (flag == null || flag.trim().isEmpty()) {
            throw new BadRequestException("Trạng thái đánh giá không được để trống");
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Đánh giá không tồn tại"));

        ReviewAdminFlag newFlag;

        try {
            newFlag = ReviewAdminFlag.valueOf(flag.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Trạng thái đánh giá không hợp lệ");
        }

        review.setAdminFlag(newFlag);

        Review updatedReview = reviewRepository.save(review);
        return mapToResponse(updatedReview);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewReportDTO> getReviewReport() {
        return reviewRepository.getReviewReport();
    }

    private void validateReviewRequest(ReviewRequestDTO request){
        if (request == null) {
            throw new BadRequestException("Dữ liệu đánh giá không hợp lệ!");
        }

        if (request.getRating() == null) {
            throw new BadRequestException("Số sao đánh giá không được để trống!");
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new BadRequestException("Số sao đánh giá phải nằm trong khoảng từ 1 đến 5");
        }
    }

    private ReviewResponseDTO mapToResponse(Review review) {
        return ReviewResponseDTO.builder()
                .reviewId(review.getReviewId())
                .productId(review.getProduct().getProductId())
                .productName(review.getProduct().getName())
                .userId(review.getUser().getUserId())
                .userName(review.getUser().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .isVerifiedPurchase(review.getIsVerifiedPurchase())
                .adminFlag(review.getAdminFlag().name())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
