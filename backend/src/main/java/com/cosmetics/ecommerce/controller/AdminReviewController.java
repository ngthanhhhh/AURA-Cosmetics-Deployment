package com.cosmetics.ecommerce.controller;

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

/**
 * Controller quản lý đánh giá sản phẩm dành cho quyền Admin.
 *
 * Controller này nhận các request liên quan đến review,
 * sau đó gọi xuống ReviewService để xử lý nghiệp vụ.
 */
@RestController
@RequestMapping("/api/v1/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {
    private final ReviewService reviewService;

    /**
     * Lấy danh sách tất cả đánh giá cho Admin.
     *
     * API này hỗ trợ lọc, tìm kiếm, phân trang và sắp xếp danh sách review.
     *
     * @param rating    Số sao cần lọc, ví dụ: 1, 2, 3, 4, 5. Không bắt buộc.
     * @param flag      Trạng thái đánh dấu của review, ví dụ: NORMAL,...
     *                  Không bắt buộc.
     * @param verified  Lọc theo trạng thái đã mua hàng hay chưa.
     *                  true nghĩa là review từ khách đã mua sản phẩm,
     *                  false nghĩa là review chưa được xác minh mua hàng.
     *                  Không bắt buộc.
     * @param productId ID sản phẩm cần lọc review. Không bắt buộc.
     * @param keyword   Từ khóa tìm kiếm trong nội dung review, tên sản phẩm
     *                  hoặc thông tin liên quan. Không bắt buộc.
     * @param page      Số thứ tự trang muốn lấy, mặc định là 0.
     * @param size      Số lượng bản ghi trên mỗi trang, mặc định là 10.
     * @param sortBy    Tên trường dùng để sắp xếp, mặc định là createdAt.
     * @param sortDir   Chiều sắp xếp, gồm asc hoặc desc, mặc định là desc.
     * @return ResponseEntity chứa Page danh sách review sau khi lọc,
     *         tìm kiếm, phân trang và sắp xếp.
     */
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

    /**
     * Cập nhật trạng thái đánh dấu của một review.
     *
     * API này cho phép Admin đánh dấu review để quản lý nội dung,
     * ví dụ: review bình thường, review bị ẩn hoặc review bị báo cáo.
     *
     * @param reviewId ID của review cần cập nhật flag.
     * @param request  Dữ liệu chứa flag mới của review.
     * @return ResponseEntity chứa thông tin review sau khi cập nhật flag.
     */
    @PutMapping("/{reviewId}/flag")
    public ResponseEntity<ReviewResponseDTO> updateReviewFlag(
        @PathVariable Integer reviewId,
        @RequestBody UpdateReviewFlagRequestDTO request
    ) {
        return ResponseEntity.ok(reviewService.updateReviewFlag(reviewId, request.getFlag()));
    }

    /**
     * Lấy báo cáo đánh giá theo sản phẩm.
     *
     * API này dùng để Admin xem thống kê review của từng sản phẩm,
     * ví dụ điểm đánh giá trung bình, số lượng review và các chỉ số liên quan.
     * Có hỗ trợ tìm kiếm, lọc theo điểm trung bình tối thiểu,
     * phân trang và sắp xếp.
     *
     * @param keyword          Từ khóa tìm kiếm theo tên sản phẩm hoặc thông tin liên quan.
     *                         Không bắt buộc.
     * @param minAverageRating Điểm đánh giá trung bình tối thiểu cần lọc.
     *                         Không bắt buộc.
     * @param page             Số thứ tự trang muốn lấy, mặc định là 0.
     * @param size             Số lượng bản ghi trên mỗi trang, mặc định là 10.
     * @param sortBy           Tên trường dùng để sắp xếp, mặc định là averageRating.
     * @param sortDir          Chiều sắp xếp, gồm asc hoặc desc, mặc định là desc.
     * @return ResponseEntity chứa Page báo cáo đánh giá theo sản phẩm.
     */
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
