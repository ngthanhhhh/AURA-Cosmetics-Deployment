package com.cosmetics.ecommerce.service;

import org.springframework.data.domain.Page;

import com.cosmetics.ecommerce.dto.ProductReviewListResponseDTO;
import com.cosmetics.ecommerce.dto.ReviewReportDTO;
import com.cosmetics.ecommerce.dto.ReviewRequestDTO;
import com.cosmetics.ecommerce.dto.ReviewResponseDTO;

/**
 * Service định nghĩa các nghiệp vụ liên quan đến đánh giá sản phẩm.
 */
public interface ReviewService {
    /**
     * Tạo đánh giá mới cho sản phẩm.
     *
     * @param userId    ID người dùng tạo đánh giá
     * @param productId ID sản phẩm được đánh giá
     * @param request   Nội dung đánh giá
     * @return Thông tin đánh giá vừa tạo
     */
    ReviewResponseDTO createReview(Integer userId, Integer productId, ReviewRequestDTO request);
    
    /**
     * Lấy danh sách đánh giá của một sản phẩm.
     *
     * @param productId ID sản phẩm cần xem đánh giá
     * @param rating    Số sao cần lọc, có thể null
     * @param verified  Trạng thái verified purchase cần lọc, có thể null
     * @param keyword   Từ khóa tìm kiếm, có thể null
     * @param page      Số trang cần lấy
     * @param size      Số lượng đánh giá trên mỗi trang
     * @param sortBy    Trường dùng để sắp xếp
     * @param sortDir   Chiều sắp xếp
     * @return Thông tin tổng hợp đánh giá sản phẩm và danh sách đánh giá theo trang
     */
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
    
    /**
     * Lấy danh sách đánh giá dành cho Admin.
     *
     * @param rating    Số sao cần lọc, có thể null
     * @param flag      Trạng thái kiểm duyệt cần lọc, có thể null
     * @param verified  Trạng thái verified purchase cần lọc, có thể null
     * @param productId ID sản phẩm cần lọc, có thể null
     * @param keyword   Từ khóa tìm kiếm, có thể null
     * @param page      Số trang cần lấy
     * @param size      Số lượng đánh giá trên mỗi trang
     * @param sortBy    Trường dùng để sắp xếp
     * @param sortDir   Chiều sắp xếp
     * @return Danh sách đánh giá dành cho Admin theo dạng phân trang
     */
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

    /**
     * Cập nhật trạng thái kiểm duyệt của một đánh giá.
     *
     * @param reviewId ID đánh giá cần cập nhật
     * @param flag     Trạng thái kiểm duyệt mới
     * @return Thông tin đánh giá sau khi cập nhật
     */
    ReviewResponseDTO updateReviewFlag(Integer reviewId, String flag);
    
    /**
     * Lấy báo cáo tổng hợp đánh giá theo sản phẩm.
     *
     * @param keyword          Từ khóa tìm kiếm, có thể null
     * @param minAverageRating Điểm đánh giá trung bình tối thiểu, có thể null
     * @param page             Số trang cần lấy
     * @param size             Số lượng report trên mỗi trang
     * @param sortBy           Trường dùng để sắp xếp
     * @param sortDir          Chiều sắp xếp
     * @return Báo cáo tổng hợp đánh giá theo dạng phân trang
     */
    Page<ReviewReportDTO> getReviewReport(
        String keyword,
        Double minAverageRating,
        int page,
        int size,
        String sortBy,
        String sortDir
    );
}
