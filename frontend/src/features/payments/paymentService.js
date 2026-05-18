import { paymentApi } from "./paymentApi";

export const paymentService = {
    async createVnPayPayment(orderId) {
        const response = await paymentApi.createVnPayPayment(orderId);
        return response.data;
    },

    async handleVnPayReturn(params) {
        const response = await paymentApi.handleVnPayReturn(params);
        return response.data;
    }
};