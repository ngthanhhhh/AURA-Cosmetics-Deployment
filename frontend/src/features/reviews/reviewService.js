import { reviewApi } from "./reviewApi";

/**
 * reviewService chứa các hàm nghiệp vụ phía frontend liên quan đến đánh giá sản phẩm.
 */
export const reviewService = {
    /**
     * Lấy danh sách đánh giá của một sản phẩm.
     *
     * @param productId ID của sản phẩm cần lấy đánh giá
     * @param params Tham số lọc, tìm kiếm, sắp xếp và phân trang
     *
     * @returns Dữ liệu danh sách đánh giá của sản phẩm
     */
    async getProductReviews(productId, params) {
        const response = await reviewApi.getProductReviews(productId, params); // Gọi API lấy đánh giá sản phẩm.
        return response.data; // Trả về phần data từ response để component dùng trực tiếp.
    },

    /**
     * Tạo đánh giá mới cho một sản phẩm.
     *
     * @param productId ID của sản phẩm được đánh giá
     * @param data Dữ liệu đánh giá
     *
     * @returns Kết quả tạo đánh giá từ backend
     */
    async createReview(productId, data) {
        const response = await reviewApi.createReview(productId, data); // Gọi API tạo đánh giá mới.
        return response.data; // Trả về dữ liệu backend gửi về.
    },

    /**
     * Lấy danh sách đánh giá phía Admin.
     *
     * @param params Tham số lọc, tìm kiếm, sắp xếp và phân trang
     * @returns Danh sách đánh giá cho Admin
     */
    async getAdminReviews(params) {
        const response = await reviewApi.getAdminReviews(params); // Gọi API lấy danh sách đánh giá phía Admin.
        return response.data; // Trả về dữ liệu danh sách đánh giá.
    },

    /**
     * Cập nhật trạng thái đánh dấu của một đánh giá.
     *
     * @param reviewId ID của đánh giá cần cập nhật
     * @param flag Trạng thái đánh dấu mới
     *
     * @returns Kết quả cập nhật trạng thái đánh giá
     */
    async updateReviewFlag(reviewId, flag) {
        const response = await reviewApi.updateReviewFlag(reviewId, flag); // Gọi API cập nhật flag của đánh giá.
        return response.data; // Trả về message/kết quả từ backend.
    },

    /**
     * Lấy báo cáo mức độ hài lòng theo sản phẩm.
     *
     * @param params Tham số tìm kiếm, lọc, sắp xếp và phân trang
     * @returns Danh sách báo cáo đánh giá theo sản phẩm
     */
    async getReviewReport(params) {
        const response = await reviewApi.getReviewReport(params); // Gọi API lấy báo cáo mức độ hài lòng.
        return response.data; // Trả về dữ liệu báo cáo từ backend.
    }
}