package com.cosmetics.ecommerce.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cosmetics.ecommerce.dto.ProductReviewListResponseDTO;
import com.cosmetics.ecommerce.dto.ReviewRequestDTO;
import com.cosmetics.ecommerce.dto.ReviewResponseDTO;
import com.cosmetics.ecommerce.service.ReviewService;

import org.springframework.web.bind.annotation.RequestBody;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/products/{productId}")
    public ResponseEntity<ReviewResponseDTO> createReview(
        @RequestParam Integer userId,
        @PathVariable Integer productId,
        @RequestBody ReviewRequestDTO request
    ){
        ReviewResponseDTO response = reviewService.createReview(userId, productId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<ProductReviewListResponseDTO> getProductReviews(
        @PathVariable Integer productId,
        @RequestParam(required = false) Integer rating
    ) {
        ProductReviewListResponseDTO response = reviewService.getProductReviews(productId, rating);
        return ResponseEntity.ok(response);
    }
}
