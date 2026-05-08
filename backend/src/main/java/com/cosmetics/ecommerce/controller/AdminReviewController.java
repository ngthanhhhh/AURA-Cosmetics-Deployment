package com.cosmetics.ecommerce.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cosmetics.ecommerce.dto.ReviewReportDTO;
import com.cosmetics.ecommerce.dto.ReviewResponseDTO;
import com.cosmetics.ecommerce.dto.UpdateReviewFlagRequestDTO;
import com.cosmetics.ecommerce.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {
    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<Page<ReviewResponseDTO>> getAllReviews(
        @RequestParam(required = false) Integer rating,
        @RequestParam(required = false) String flag,
        @RequestParam(required = false) Boolean verified,
        @RequestParam(required = false) Integer productId,
        @RequestParam(required = false) String keyword,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Page<ReviewResponseDTO> result = reviewService.getAllReviewsForAdmin(
            rating, 
            flag, 
            verified, 
            productId, 
            keyword, 
            page, 
            size, 
            sortBy, 
            sortDir);

        return ResponseEntity.ok(result);
    }

    @PutMapping("/{reviewId}/flag")
    public ResponseEntity<ReviewResponseDTO> updateReviewFlag(
        @PathVariable Integer reviewId,
        @RequestBody UpdateReviewFlagRequestDTO request
    ) {
        return ResponseEntity.ok(reviewService.updateReviewFlag(reviewId, request.getFlag()));
    }

    @GetMapping("/report")
    public ResponseEntity<Page<ReviewReportDTO>> getReviewReport(
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) Double minAverageRating,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "averageRating") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir
    ){
        Page<ReviewReportDTO> result = reviewService.getReviewReport(
            keyword, 
            minAverageRating, 
            page, 
            size, 
            sortBy, 
            sortDir
        );
        return ResponseEntity.ok(result);
    }
}
