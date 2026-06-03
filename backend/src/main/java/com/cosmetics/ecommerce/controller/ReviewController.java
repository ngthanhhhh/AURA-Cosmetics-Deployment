package com.cosmetics.ecommerce.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cosmetics.ecommerce.dto.ProductReviewListResponseDTO;
import com.cosmetics.ecommerce.dto.ReviewRequestDTO;
import com.cosmetics.ecommerce.dto.ReviewResponseDTO;
import com.cosmetics.ecommerce.security.CurrentUserProvider;
import com.cosmetics.ecommerce.service.ReviewService;

import org.springframework.web.bind.annotation.RequestBody;
import lombok.RequiredArgsConstructor;

/**
 * Controller xử lý các API đánh giá sản phẩm ở phía khách hàng.
 *
 * Controller này cho phép khách hàng tạo đánh giá cho sản phẩm
 * và cho phép người dùng xem danh sách đánh giá của một sản phẩm.
 */
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;
    private final CurrentUserProvider currentUserProvider;

    /**
     * Tạo đánh giá mới cho một sản phẩm.
     *
     * API này dùng khi khách hàng đã đăng nhập và muốn đánh giá sản phẩm.
     * Hệ thống sẽ lấy userId từ Authentication, lấy productId từ URL,
     * sau đó gửi dữ liệu đánh giá xuống ReviewService để xử lý.
     *
     * @param authentication Thông tin xác thực của người dùng hiện tại.
     * @param productId      ID của sản phẩm cần đánh giá.
     * @param request        Dữ liệu đánh giá, gồm số sao và nội dung bình luận.
     * @return ResponseEntity chứa thông tin đánh giá vừa được tạo.
     */
    @PostMapping("/{productId}/reviews")
    public ResponseEntity<ReviewResponseDTO> createReview(
        Authentication authentication,
        @PathVariable Integer productId,
        @RequestBody ReviewRequestDTO request
    ){
        Integer userId = currentUserProvider.getCurrentUserId(authentication);
        ReviewResponseDTO response = reviewService.createReview(userId, productId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Lấy danh sách đánh giá của một sản phẩm.
     *
     * API này dùng để hiển thị các đánh giá của sản phẩm cho người dùng.
     * Có hỗ trợ lọc theo số sao, trạng thái đã mua hàng, tìm kiếm,
     * phân trang và sắp xếp.
     *
     * @param productId ID của sản phẩm cần xem đánh giá.
     * @param rating    Số sao cần lọc, ví dụ: 1, 2, 3, 4, 5. Không bắt buộc.
     * @param verified  Lọc theo trạng thái đã mua hàng hay chưa.
     *                  true nghĩa là review từ khách đã mua sản phẩm.
     *                  false nghĩa là review chưa được xác minh mua hàng.
     *                  Không bắt buộc.
     * @param keyword   Từ khóa tìm kiếm trong nội dung đánh giá. Không bắt buộc.
     * @param page      Số thứ tự trang muốn lấy, mặc định là 0.
     * @param size      Số lượng bản ghi trên mỗi trang, mặc định là 10.
     * @param sortBy    Tên trường dùng để sắp xếp, mặc định là createdAt.
     * @param sortDir   Chiều sắp xếp, gồm asc hoặc desc, mặc định là desc.
     * @return ResponseEntity chứa danh sách đánh giá của sản phẩm,
     *         kèm thông tin thống kê/tổng quan nếu có trong DTO.
     */
    @GetMapping("/{productId}/reviews")
    public ResponseEntity<ProductReviewListResponseDTO> getProductReviews(
        @PathVariable Integer productId,
        @RequestParam(required = false) Integer rating,
        @RequestParam(required = false) Boolean verified,
        @RequestParam(required = false) String keyword,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir
    ) {
        ProductReviewListResponseDTO response = reviewService.getProductReviews(
            productId, 
            rating,
            verified,
            keyword,
            page,
            size,
            sortBy,
            sortDir
        );
        return ResponseEntity.ok(response);
    }
}
