package com.cosmetics.ecommerce.service.impl;

import com.cosmetics.ecommerce.dto.ReviewRequestDTO;
import com.cosmetics.ecommerce.dto.ReviewResponseDTO;
import com.cosmetics.ecommerce.entity.Product;
import com.cosmetics.ecommerce.entity.Review;
import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.enums.OrderStatus;
import com.cosmetics.ecommerce.enums.ReviewAdminFlag;
import com.cosmetics.ecommerce.exception.BadRequestException;
import com.cosmetics.ecommerce.repository.OrderItemRepository;
import com.cosmetics.ecommerce.repository.ProductRepository;
import com.cosmetics.ecommerce.repository.ReviewRepository;
import com.cosmetics.ecommerce.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @InjectMocks
    private ReviewServiceImpl reviewService;

    @Test
    void createReview_ShouldThrowException_WhenRatingInvalid(){
        ReviewRequestDTO request = new ReviewRequestDTO();
        request.setRating(6);
        request.setComment("Test review");

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> reviewService.createReview(1, 1, request)
        );

        assertEquals(
                "Số sao đánh giá phải nằm trong khoảng từ 1 đến 5",
                exception.getMessage()
        );
    }

    @Test
    void createReview_ShouldSetVerifiedPurchaseTrue_WhenUserPurchasedProductCompleted(){
        User user = new User();
        user.setUserId(1);
        user.setName("Test User");

        Product product = new Product();
        product.setProductId(1);
        product.setName("Test Product");

        ReviewRequestDTO request = new ReviewRequestDTO();
        request.setRating(5);
        request.setComment("Sản phẩm tốt");

        when(userRepository.findById(1))
                .thenReturn(Optional.of(user));

        when(productRepository.findById(1))
                .thenReturn(Optional.of(product));

        when(orderItemRepository.existsByOrder_User_UserIdAndProduct_ProductIdAndOrder_Status(
                1, 1, OrderStatus.COMPLETED
        )).thenReturn(true);

        when(reviewRepository.save(any(Review.class)))
                .thenAnswer(invocation -> {
                    Review review = invocation.getArgument(0);
                    review.setReviewId(1);
                    review.setAdminFlag(ReviewAdminFlag.NORMAL);
                    return review;
                });

        ReviewResponseDTO response = reviewService.createReview(1, 1, request);

        assertEquals(5, response.getRating());
        assertTrue(response.getIsVerifiedPurchase());
        assertEquals("NORMAL", response.getAdminFlag());
    }
}
