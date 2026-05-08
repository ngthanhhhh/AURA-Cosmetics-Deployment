package com.cosmetics.ecommerce.service.impl;

import org.springframework.data.domain.PageImpl;

import java.util.Comparator;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

/**
 * Service triển khai các nghiệp vụ liên quan đến đánh giá sản phẩm (Review).
 *
 * Bao gồm:
 * - Tạo đánh giá cho sản phẩm
 * - Xem danh sách đánh giá của sản phẩm (có lọc theo số sao)
 * - Admin xem toàn bộ đánh giá
 * - Admin cập nhật trạng thái kiểm duyệt đánh giá
 * - Lấy báo cáo tổng hợp đánh giá
 */
@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService{
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;

    private static final Set<String> REVIEW_SORT_FIELDS = Set.of(
        "reviewId",
        "createdAt",
        "updatedAt",
        "rating",
        "adminFlag",
        "isVerifiedPurchase"
    );

    private static final Set<String> REVIEW_REPORT_SORT_FIELDS = Set.of(
        "productId",
        "productName",
        "totalReviews",
        "averageRating",
        "satisfactionRate"
    );
    
    /**
     * Tạo đánh giá mới cho sản phẩm.
     *
     * Quy trình:
     * - Validate request (rating hợp lệ)
     * - Kiểm tra user tồn tại
     * - Kiểm tra sản phẩm tồn tại
     * - Kiểm tra user đã mua sản phẩm chưa (verified purchase)
     * - Tạo Review và gán các thông tin cần thiết
     * - Lưu vào database
     * - Trả về DTO cho frontend
     *
     * @param userId ID người dùng
     * @param productId ID sản phẩm
     * @param request Nội dung đánh giá
     * @return Thông tin đánh giá vừa tạo
     */
    @Override
    @Transactional
    public ReviewResponseDTO createReview(Integer userId, Integer productId, ReviewRequestDTO request) {
        validateUserId(userId);
        validateProductId(productId);
        validateReviewRequest(request);

        User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại!"));
        Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại!"));

        // Kiểm tra user đã mua sản phẩm này và đơn đã COMPLETED hay chưa
        boolean isVerifiedPurchase = orderItemRepository.existsByOrder_User_UserIdAndProduct_ProductIdAndOrder_Status(
            userId, productId, OrderStatus.COMPLETED
        );

        // Tạo review mới
        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(request.getRating());
        review.setComment(normalizeComment(request.getComment()));
        review.setIsVerifiedPurchase(isVerifiedPurchase);

        // Mặc định review ở trạng thái bình thường (chưa bị flag)
        review.setAdminFlag(ReviewAdminFlag.NORMAL);

        // Đánh dấu có phải người mua thật hay không
        Review savedReview = reviewRepository.save(review);

        return mapToResponse(savedReview);
    }

    /**
     * Lấy danh sách đánh giá của một sản phẩm (có thể lọc theo số sao).
     *
     * Quy trình:
     * - Kiểm tra sản phẩm tồn tại
     * - Validate rating filter (nếu có)
     * - Lấy toàn bộ review để tính điểm trung bình
     * - Nếu có filter → chỉ lấy review theo số sao
     * - Tính average rating
     * - Map sang DTO
     *
     * @param productId ID sản phẩm
     * @param rating Số sao cần lọc (có thể null)
     * @return Thông tin tổng hợp đánh giá sản phẩm
     */
    @Override
    @Transactional(readOnly = true)
    public ProductReviewListResponseDTO getProductReviews(
        Integer productId, 
        Integer rating,
        Boolean verified,
        String keyword,
        int page,
        int size,
        String sortBy,
        String sortDir
    ) {
        validateProductId(productId);
        Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại!"));

        validateRatingFilter(rating);

        Pageable pageable = buildPageable(
            page,
            size,
            sortBy,
            sortDir,
            REVIEW_SORT_FIELDS,
            "createdAt"
        );

        Page<ReviewResponseDTO> reviewPage = reviewRepository.searchProductReviews(
            productId, 
            rating, 
            verified, 
            normalizeKeyword(keyword), 
            pageable).map(this::mapToResponse);

        Double averageRatingValue = reviewRepository.calculateAverageRatingByProductId(productId);
        
        // Tính điểm trung bình
        double averageRating = averageRatingValue == null ? 0.0 : averageRatingValue;

        Long totalReviews = reviewRepository.countByProduct_ProductId(productId);

        return ProductReviewListResponseDTO.builder()
            .productId(product.getProductId())
            .productName(product.getName())
            .averageRating(averageRating)
            .totalReviews(totalReviews != null ? totalReviews.intValue() : 0)
            .reviews(reviewPage.getContent())
            .pageNumber(reviewPage.getNumber())
            .pageSize(reviewPage.getSize())
            .totalElements(reviewPage.getTotalElements())
            .totalPages(reviewPage.getTotalPages())
            .first(reviewPage.isFirst())
            .last(reviewPage.isLast())
            .build();
    }

    /**
     * Lấy toàn bộ đánh giá (dành cho Admin).
     *
     * @return Danh sách tất cả review
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponseDTO> getAllReviewsForAdmin(
        Integer rating,
        String flag,
        Boolean verified,
        Integer productId,
        String keyword,
        int page,
        int size,
        String sortBy,
        String sortDir
    ) {
        validateRatingFilter(rating);
        ReviewAdminFlag parsedFlag = parseNullableReviewFlag(flag);

        Pageable pageable = buildPageable(
            page,
            size,
            sortBy,
            sortDir,
            REVIEW_SORT_FIELDS,
            "createdAt"
        );

        return reviewRepository.searchAdminReviews(
            rating,
            parsedFlag,
            verified,
            productId,
            normalizeKeyword(keyword),
            pageable
        ).map(this::mapToResponse);
    }
    /**
     * Cập nhật trạng thái kiểm duyệt của một đánh giá (Admin).
     *
     * Quy trình:
     * - Validate input flag
     * - Tìm review
     * - Parse flag sang enum
     * - Cập nhật trạng thái
     * - Lưu và trả về DTO
     *
     * @param reviewId ID đánh giá
     * @param flag Trạng thái mới (NORMAL, NEGATIVE_FEEDBACK, ATTENTION_NEEDED)
     * @return Review sau khi cập nhật
     */
    @Override
    @Transactional
    public ReviewResponseDTO updateReviewFlag(Integer reviewId, String flag) {
        validateReviewId(reviewId);

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

        if (review.getAdminFlag() == newFlag) {
            throw new BadRequestException("Đánh giá đang ở trạng thái này.");
        }

        review.setAdminFlag(newFlag);

        Review updatedReview = reviewRepository.save(review);
        return mapToResponse(updatedReview);
    }

    /**
     * Lấy báo cáo tổng hợp đánh giá (thống kê).
     *
     * @return Danh sách report (custom query)
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ReviewReportDTO> getReviewReport(
        String keyword,
        Double minAverageRating,
        int page,
        int size,
        String sortBy,
        String sortDir
    ) {
        if (minAverageRating != null && (minAverageRating < 0 || minAverageRating > 5)) {
            throw new BadRequestException("Số sao trung bình phải từ 0 đến 5");
        }

        Pageable pageable = buildReportPageable(page, size, sortBy, sortDir);

        List<ReviewReportDTO> reports = reviewRepository.searchReviewReport(
            normalizeKeyword(keyword),
            minAverageRating
        );

        Comparator<ReviewReportDTO> comparator = buildReviewReportComparator(sortBy);

        Sort.Direction direction = parseSortDirection(sortDir);
        if (direction == Sort.Direction.DESC) {
            comparator = comparator.reversed();
        }

        List<ReviewReportDTO> sortedReports = reports.stream()
            .sorted(comparator)
            .toList();
            
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), sortedReports.size());

        List<ReviewReportDTO> pageContent = start >= sortedReports.size() 
            ? List.of() : sortedReports.subList(start, end);

        return new PageImpl<>(pageContent, pageable, sortedReports.size());
    }

    /**
     * Validate request tạo review.
     *
     * Điều kiện:
     * - Request không null
     * - Rating không null
     * - Rating nằm trong khoảng 1 → 5
     */
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

    /**
     * Mapping Review entity sang DTO trả về cho client.
     */
    private ReviewResponseDTO mapToResponse(Review review) {
        Product product = review.getProduct();
        User user = review.getUser();

        return ReviewResponseDTO.builder()
                .reviewId(review.getReviewId())
                .productId(product != null ? product.getProductId() : null)
                .productName(product != null ? product.getName() : "Sản phẩm không còn tồn tại!")
                .userId(user != null ? user.getUserId() : null)
                .userName(user != null ? user.getName() : "Người dùng không còn tồn tại!")
                .rating(review.getRating())
                .comment(review.getComment())
                .isVerifiedPurchase(review.getIsVerifiedPurchase())
                .adminFlag(review.getAdminFlag() != null ? review.getAdminFlag().name() : ReviewAdminFlag.NORMAL.name())
                .createdAt(review.getCreatedAt())
                .build();
    }

    private void validateUserId(Integer userId) {
        if (userId == null) {
            throw new BadRequestException("Người dùng không hợp lệ!");
        }
    }

    private void validateProductId(Integer productId) {
        if (productId == null) {
            throw new BadRequestException("Mã sản phẩm không hợp lệ!");
        }
    }

    private String normalizeComment(String comment) {
        if (comment == null || comment.trim().isEmpty()) {
            return null;
        }
        return comment.trim();
    }

    private void validateReviewId(Integer reviewId) {
        if (reviewId == null) {
            throw new BadRequestException("Mã đánh giá không hợp lệ!");
        }
    }

    private Pageable buildPageable(
        int page,
        int size,
        String sortBy,
        String sortDir,
        Set<String> allowedSortFields,
        String defaultSortBy
    ){
        if (page < 0) {
            throw new BadRequestException("Số trang không hợp lệ!");
        }

        if (size <= 0 || size > 100) {
            throw new BadRequestException("Kích thước trang phải từ 1 đến 100!");
        }

        String finalSortBy = (sortBy == null || sortBy.trim().isEmpty()) 
            ? defaultSortBy : sortBy.trim();

        if (!allowedSortFields.contains(finalSortBy)) {
            throw new BadRequestException("Tiêu chí sắp xếp không hợp lệ!");
        }

        Sort.Direction direction = parseSortDirection(sortDir);

        return PageRequest.of(page, size, Sort.by(direction, finalSortBy));
    }

    private Pageable buildReportPageable(int page, int size, String sortBy, String sortDir) {
        if (page < 0) {
            throw new BadRequestException("Số trang không hợp lệ!");
        }

        if (size <= 0 || size > 100) {
            throw new BadRequestException("Kích thước trang phải từ 1 đến 100!");
        }

        String finalSortBy = (sortBy == null || sortBy.trim().isEmpty())
            ? "averageRating" : sortBy.trim();

        if (!REVIEW_REPORT_SORT_FIELDS.contains(finalSortBy)) {
            throw new BadRequestException("Tiêu chí sắp xếp báo cáo đánh giá không hợp lệ!");
        }

        parseSortDirection(sortDir);

        return PageRequest.of(page, size);
    }

    private Sort.Direction parseSortDirection(String sortDir) {
        if (sortDir == null || sortDir.trim().isEmpty()) {
            return Sort.Direction.DESC;
        }

        if ("asc".equalsIgnoreCase(sortDir.trim())) {
            return Sort.Direction.ASC;
        }

        if ("desc".equalsIgnoreCase(sortDir.trim())) {
            return Sort.Direction.DESC;
        }

        throw new BadRequestException("Hướng sắp xếp chỉ được là asc hoặc desc!");
    }

    private void validateRatingFilter(Integer rating) {
        if (rating != null && (rating < 1 || rating > 5)) {
            throw new BadRequestException("Số sao lọc phải nằm trong khoảng từ 1 đến 5!");
        }
    }

    private ReviewAdminFlag parseNullableReviewFlag(String flag) {
        if (flag == null || flag.trim().isEmpty()) {
            return null;
        }

        try {
            return ReviewAdminFlag.valueOf(flag.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Trạng thái đánh giá không hợp lệ!");
        }
    }

    private String normalizeKeyword(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return null;
        }

        return keyword.trim();
    }

    private Comparator<ReviewReportDTO> buildReviewReportComparator(String sortBy) {
        String finalSortBy = (sortBy == null || sortBy.trim().isEmpty()) 
            ? "averageRating" : sortBy.trim();
        
        return switch (finalSortBy) {
            case "productId" -> Comparator.comparing(
                ReviewReportDTO::getProductId,
                Comparator.nullsLast(Integer::compareTo)
            );

            case "productName" -> Comparator.comparing(
                ReviewReportDTO::getProductName,
                Comparator.nullsLast(String::compareToIgnoreCase)
            );

            case "totalReviews" -> Comparator.comparing(
                ReviewReportDTO::getTotalReviews,
                Comparator.nullsLast(Long::compareTo)
            );

            case "averageRating" -> Comparator.comparing(
                ReviewReportDTO::getAverageRating,
                Comparator.nullsLast(Double::compareTo)
            );

            case "satisfactionRate" -> Comparator.comparing(
                ReviewReportDTO::getSatisfactionRate,
                Comparator.nullsLast(Double::compareTo)
            );

            default -> throw new BadRequestException("Tiêu chí sắp xếp báo cáo đánh giá không hợp lệ!");
        };
    }
}
