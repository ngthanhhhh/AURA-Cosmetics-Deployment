import { reviewApi } from "./reviewApi";

export const reviewService = {
    async getProductReviews(productId, params) {
        const response = await reviewApi.getProductReviews(productId, params);
        return response.data;
    },

    async createReview(productId, data) {
        const response = await reviewApi.createReview(productId, data);
        return response.data;
    },

    async getAdminReviews(params) {
        const response = await reviewApi.getAdminReviews(params);
        return response.data;
    },

    async updateReviewFlag(reviewId, flag) {
        const response = await reviewApi.updateReviewFlag(reviewId, flag);
        return response.data;
    },

    async getReviewReport(params) {
        const response = await reviewApi.getReviewReport(params);
        return response.data;
    }
}