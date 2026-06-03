import axiosClient from "../../api/axiosClient";

/**
 * reviewApi chứa các hàm gọi API liên quan đến đánh giá sản phẩm.
 */
export const reviewApi = {
  /**
   * Gọi API lấy danh sách đánh giá của một sản phẩm.
   *
   * @param productId ID của sản phẩm cần lấy đánh giá
   * @param params Tham số lọc, tìm kiếm, sắp xếp và phân trang
   * @returns Promise chứa danh sách đánh giá của sản phẩm
   */
  getProductReviews(productId, params) {
    return axiosClient.get(`/products/${productId}/reviews`, { params });
  },

  /**
   * Gọi API tạo đánh giá mới cho một sản phẩm.
   *
   * @param productId ID của sản phẩm được đánh giá
   * @param data Dữ liệu đánh giá gửi lên backend
   * @returns Promise chứa kết quả tạo đánh giá
   */
  createReview(productId, data) {
    return axiosClient.post(`/products/${productId}/reviews`, data);
  },

  /**
   * Gọi API lấy danh sách đánh giá phía Admin.
   *
   * @param params Tham số lọc, tìm kiếm, sắp xếp và phân trang
   * @returns Promise chứa danh sách đánh giá cho Admin
   */
  getAdminReviews(params) {
    return axiosClient.get("/admin/reviews", { params });
  },

  /**
   * Gọi API cập nhật trạng thái đánh dấu của một đánh giá.
   *
   * @param reviewId ID của đánh giá cần cập nhật
   * @param flag Trạng thái đánh dấu mới
   * @returns Promise chứa kết quả cập nhật trạng thái đánh giá
   */
  updateReviewFlag(reviewId, flag) {
    return axiosClient.put(`/admin/reviews/${reviewId}/flag`, { flag });
  },

  /**
   * Gọi API lấy báo cáo mức độ hài lòng theo sản phẩm.
   *
   * @param params Tham số tìm kiếm, lọc, sắp xếp và phân trang
   * @returns Promise chứa danh sách báo cáo đánh giá theo sản phẩm
   */
  getReviewReport(params) {
    return axiosClient.get("/admin/reviews/report", { params });
  },
};