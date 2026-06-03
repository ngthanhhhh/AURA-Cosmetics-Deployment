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
     * Quy trình xử lý:
     * - Kiểm tra userId, productId và request đánh giá hợp lệ
     * - Kiểm tra người dùng tồn tại
     * - Kiểm tra sản phẩm tồn tại
     * - Kiểm tra người dùng đã mua sản phẩm và đơn hàng đã COMPLETED hay chưa
     * - Tạo Review và gán thông tin user, product, rating, comment
     * - Gán trạng thái verified purchase nếu thỏa điều kiện
     * - Lưu Review vào database
     * - Trả về ReviewResponseDTO cho frontend
     *
     * @param userId    ID người dùng tạo đánh giá
     * @param productId ID sản phẩm được đánh giá
     * @param request   Nội dung đánh giá từ client
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
     * Lấy danh sách đánh giá của một sản phẩm.
     *
     * Method này hỗ trợ:
     * - Lọc theo số sao đánh giá
     * - Lọc theo trạng thái verified purchase
     * - Tìm kiếm theo từ khóa
     * - Phân trang
     * - Sắp xếp theo các trường được cho phép
     *
     * Quy trình xử lý:
     * - Kiểm tra productId hợp lệ
     * - Kiểm tra sản phẩm tồn tại
     * - Validate rating filter nếu có
     * - Tạo Pageable từ page, size, sortBy và sortDir
     * - Truy vấn danh sách review theo các điều kiện lọc/tìm kiếm
     * - Tính điểm đánh giá trung bình của sản phẩm
     * - Đếm tổng số đánh giá của sản phẩm
     * - Đóng gói dữ liệu tổng hợp và danh sách review vào ProductReviewListResponseDTO
     *
     * @param productId ID sản phẩm cần lấy danh sách đánh giá
     * @param rating    Số sao cần lọc, có thể null
     * @param verified  Trạng thái verified purchase cần lọc, có thể null
     * @param keyword   Từ khóa tìm kiếm trong đánh giá, có thể null
     * @param page      Số thứ tự trang cần lấy, bắt đầu từ 0
     * @param size      Số lượng đánh giá trên mỗi trang
     * @param sortBy    Trường dùng để sắp xếp
     * @param sortDir   Chiều sắp xếp, gồm asc hoặc desc
     * @return Thông tin tổng hợp đánh giá của sản phẩm và danh sách review theo trang
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

        // Tạo thông tin phân trang/sắp xếp cho danh sách review.
        Pageable pageable = buildPageable(
            page,
            size,
            sortBy,
            sortDir,
            REVIEW_SORT_FIELDS,
            "createdAt"
        );

        // query danh sách review của sản phẩm.
        Page<ReviewResponseDTO> reviewPage = reviewRepository.searchProductReviews(
            productId, 
            rating, 
            verified, 
            normalizeKeyword(keyword), 
            pageable).map(this::mapToResponse);

        // Tính điểm trung bình tất cả review của sản phẩm.
        Double averageRatingValue = reviewRepository.calculateAverageRatingByProductId(productId);
        
        // Nếu sản phẩm chưa có review thì kết quả trung bình có thể là null.
        double averageRating = averageRatingValue == null ? 0.0 : averageRatingValue;

        // Đếm tổng số review của sản phẩm đó.
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
     * Lấy danh sách đánh giá dành cho Admin.
     *
     * Method này hỗ trợ:
     * - Lọc theo số sao đánh giá
     * - Lọc theo trạng thái flag của Admin
     * - Lọc theo trạng thái verified purchase
     * - Lọc theo sản phẩm
     * - Tìm kiếm theo từ khóa
     * - Phân trang
     * - Sắp xếp theo các trường được cho phép
     *
     * Quy trình xử lý:
     * - Validate rating filter nếu có
     * - Parse flag từ String sang ReviewAdminFlag nếu có
     * - Tạo Pageable từ page, size, sortBy và sortDir
     * - Truy vấn danh sách review theo các điều kiện lọc/tìm kiếm
     * - Map Review entity sang ReviewResponseDTO
     *
     * @param rating    Số sao cần lọc, có thể null
     * @param flag      Trạng thái flag của Admin, có thể null
     * @param verified  Trạng thái verified purchase cần lọc, có thể null
     * @param productId ID sản phẩm cần lọc, có thể null
     * @param keyword   Từ khóa tìm kiếm trong đánh giá, có thể null
     * @param page      Số thứ tự trang cần lấy, bắt đầu từ 0
     * @param size      Số lượng đánh giá trên mỗi trang
     * @param sortBy    Trường dùng để sắp xếp
     * @param sortDir   Chiều sắp xếp, gồm asc hoặc desc
     * @return Page chứa danh sách đánh giá sau khi lọc, tìm kiếm, phân trang và sắp xếp
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

        //Tạo thông tin phân trang/sắp xếp.
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
     * Cập nhật trạng thái kiểm duyệt của một đánh giá dành cho Admin.
     *
     * Quy trình xử lý:
     * - Kiểm tra reviewId hợp lệ
     * - Kiểm tra flag không được để trống
     * - Tìm đánh giá theo reviewId
     * - Parse flag từ String sang enum ReviewAdminFlag
     * - Kiểm tra đánh giá có đang ở trạng thái mới chưa
     * - Cập nhật trạng thái kiểm duyệt
     * - Lưu thay đổi vào database
     * - Trả về ReviewResponseDTO sau khi cập nhật
     *
     * @param reviewId ID của đánh giá cần cập nhật
     * @param flag     Trạng thái kiểm duyệt mới, ví dụ: NORMAL, NEGATIVE_FEEDBACK, ATTENTION_NEEDED
     * @return Thông tin đánh giá sau khi cập nhật trạng thái kiểm duyệt
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
     * Lấy báo cáo tổng hợp đánh giá theo từng sản phẩm dành cho Admin.
     *
     * Method này hỗ trợ:
     * - Tìm kiếm theo từ khóa
     * - Lọc theo điểm đánh giá trung bình tối thiểu
     * - Sắp xếp theo các trường của report
     * - Phân trang kết quả
     *
     * Quy trình xử lý:
     * - Kiểm tra minAverageRating phải nằm trong khoảng 0 đến 5 nếu có truyền
     * - Tạo Pageable cho report từ page, size, sortBy và sortDir
     * - Truy vấn dữ liệu báo cáo đánh giá từ repository
     * - Tạo comparator để sắp xếp danh sách report
     * - Sắp xếp danh sách report theo sortBy và sortDir
     * - Cắt danh sách theo page và size để phân trang thủ công
     * - Trả về Page chứa danh sách ReviewReportDTO
     *
     * @param keyword          Từ khóa tìm kiếm, có thể null
     * @param minAverageRating Điểm đánh giá trung bình tối thiểu, có thể null
     * @param page             Số thứ tự trang cần lấy, bắt đầu từ 0
     * @param size             Số lượng report trên mỗi trang
     * @param sortBy           Trường dùng để sắp xếp
     * @param sortDir          Chiều sắp xếp, gồm asc hoặc desc
     * @return Page chứa báo cáo tổng hợp đánh giá sau khi lọc, sắp xếp và phân trang
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

        // Tạo thông tin phân trang/sắp xếp cho report.
        Pageable pageable = buildReportPageable(page, size, sortBy, sortDir);

        // Lấy danh sách report từ repository theo keyword và điểm trung bình tối thiểu.
        List<ReviewReportDTO> reports = reviewRepository.searchReviewReport(
            normalizeKeyword(keyword),
            minAverageRating
        );

        // Tạo bộ so sánh để sort report theo field được chọn
        Comparator<ReviewReportDTO> comparator = buildReviewReportComparator(sortBy);

        Sort.Direction direction = parseSortDirection(sortDir);
        if (direction == Sort.Direction.DESC) {
            comparator = comparator.reversed();
        }

        List<ReviewReportDTO> sortedReports = reports.stream()
            .sorted(comparator) //Sắp xếp danh sách report.
            .toList();
            
        // Lấy vị trí bắt đầu của trang hiện tại.
        // Ví dụ: page = 2, size = 10 thì offset = 20.
        int start = (int) pageable.getOffset();

        // Tính vị trí kết thúc của trang hiện tại.
        // Dùng Math.min để end không vượt quá tổng số report hiện có.
        int end = Math.min(start + pageable.getPageSize(), sortedReports.size());

        // Nếu start vượt quá tổng số phần tử thì trang này không có dữ liệu,
        // trả về danh sách rỗng.
        // Ngược lại, cắt danh sách từ start đến end để lấy dữ liệu của trang hiện tại.
        List<ReviewReportDTO> pageContent = start >= sortedReports.size() 
            ? List.of() : sortedReports.subList(start, end);

        // Đóng gói dữ liệu trang hiện tại thành Page,
        // kèm thông tin phân trang và tổng số phần tử.
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

    /**
     * Tạo đối tượng Pageable dùng cho các truy vấn có phân trang và sắp xếp.
     *
     * Method này dùng chung cho nhiều danh sách review/report.
     * Nó kiểm tra page, size, sortBy và sortDir trước khi tạo Pageable.
     *
     * Quy trình xử lý:
     * - Kiểm tra số trang không được âm
     * - Kiểm tra kích thước trang phải nằm trong khoảng 1 đến 100
     * - Nếu sortBy rỗng thì dùng trường sắp xếp mặc định
     * - Kiểm tra sortBy có thuộc danh sách field được phép sắp xếp hay không
     * - Chuyển sortDir sang Sort.Direction
     * - Tạo PageRequest chứa thông tin phân trang và sắp xếp
     *
     * @param page              Số thứ tự trang cần lấy, bắt đầu từ 0
     * @param size              Số lượng phần tử trên mỗi trang
     * @param sortBy            Trường dùng để sắp xếp, có thể null
     * @param sortDir           Chiều sắp xếp, gồm asc hoặc desc
     * @param allowedSortFields Danh sách các field được phép dùng để sắp xếp
     * @param defaultSortBy     Field sắp xếp mặc định nếu client không truyền sortBy
     * @return Pageable chứa thông tin phân trang và sắp xếp hợp lệ
     */
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

    /**
     * Tạo đối tượng Pageable dùng cho báo cáo tổng hợp đánh giá.
     *
     * Method này kiểm tra thông tin phân trang và trường sắp xếp
     * trước khi tạo Pageable cho report.
     *
     * Quy trình xử lý:
     * - Kiểm tra số trang không được âm
     * - Kiểm tra kích thước trang phải nằm trong khoảng 1 đến 100
     * - Nếu sortBy rỗng thì mặc định sắp xếp theo averageRating
     * - Kiểm tra sortBy có thuộc danh sách field report được phép sắp xếp hay không
     * - Kiểm tra sortDir có hợp lệ hay không
     * - Tạo PageRequest chứa thông tin page và size
     *
     * Lưu ý: Method này chỉ validate sortBy/sortDir và tạo PageRequest theo page, size.
     * Việc sắp xếp report được xử lý thủ công bằng Comparator ở service.
     *
     * @param page    Số thứ tự trang cần lấy, bắt đầu từ 0
     * @param size    Số lượng report trên mỗi trang
     * @param sortBy  Trường dùng để sắp xếp report, có thể null
     * @param sortDir Chiều sắp xếp, gồm asc hoặc desc
     * @return Pageable chứa thông tin phân trang cho báo cáo đánh giá
     */
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

    /**
     * Chuyển đổi chuỗi hướng sắp xếp từ request sang Sort.Direction.
     *
     * Nếu sortDir không được truyền hoặc rỗng, hệ thống mặc định dùng DESC.
     * Method này chỉ chấp nhận hai giá trị hợp lệ là asc và desc.
     *
     * @param sortDir Hướng sắp xếp dạng String từ request
     * @return Sort.Direction tương ứng dùng cho Pageable hoặc Comparator
     */
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

    /**
     * Tạo Comparator dùng để sắp xếp báo cáo tổng hợp đánh giá.
     *
     * Method này dựa vào sortBy để chọn field cần sắp xếp.
     * Nếu sortBy không được truyền hoặc rỗng, hệ thống mặc định
     * sắp xếp theo averageRating.
     *
     * Các field được hỗ trợ gồm:
     * - productId
     * - productName
     * - totalReviews
     * - averageRating
     * - satisfactionRate
     *
     * @param sortBy Trường dùng để sắp xếp báo cáo đánh giá
     * @return Comparator dùng để sắp xếp danh sách ReviewReportDTO
     */
    private Comparator<ReviewReportDTO> buildReviewReportComparator(String sortBy) {
        String finalSortBy = (sortBy == null || sortBy.trim().isEmpty()) 
            ? "averageRating" : sortBy.trim();
        
        return switch (finalSortBy) {
            case "productId" -> Comparator.comparing(
                ReviewReportDTO::getProductId, //method reference, tương đương:report -> report.getProductId()
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
