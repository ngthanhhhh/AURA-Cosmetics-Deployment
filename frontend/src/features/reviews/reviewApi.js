import axiosClient from "../../api/axiosClient";

export const reviewApi = {
    getProductReviews(productId, params) {
        return axiosClient.get(`/products/${productId}/reviews`, {params});
    },

    createReview(product, data) {
        return axiosClient.post(`/products/${productId}/reviews`, data);
    },

    getAdminReviews(params) {
        return axiosClient.get("/admin/reviews", {params});
    },

    updateReviewFlag(reviewId, flag) {
        return axiosClient.put(`/admin/reviews/${reviewId}/flag`, {flag});
    },

    getReviewReport(params) {
        return axiosClient.get("/admin/reviews/report", {params});
    }
}