import axiosClient from "../../api/axiosClient";

export const paymentApi = {
    createVnPayPayment(orderId) {
        return axiosClient.post(`/payments/vnpay/${orderId}`);
    },

    handleVnPayReturn(params) {
        return axiosClient.get("/payments/vnpay-return", {params});
    }
};