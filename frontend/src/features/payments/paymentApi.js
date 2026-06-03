import axiosClient from "../../api/axiosClient";

/**
 * paymentApi chứa các hàm gọi API liên quan đến thanh toán.
 *
 * File này chỉ chịu trách nhiệm gửi HTTP request đến backend.
 */
export const paymentApi = {
    /**
     * Gọi API tạo URL thanh toán VNPay cho một đơn hàng.
     *
     * @param orderId ID của đơn hàng cần thanh toán bằng VNPay
     * @returns Promise chứa URL thanh toán VNPay do backend tạo
     */
    createVnPayPayment(orderId) {
        return axiosClient.post(`/payments/vnpay/${orderId}`);
    },

   /**
     * Gọi API xử lý kết quả VNPay trả về.
     *
     * @param params Các tham số VNPay redirect về trên URL,
     * ví dụ: vnp_ResponseCode, vnp_TxnRef, vnp_TransactionNo,...
     *
     * @returns Promise chứa kết quả xử lý thanh toán từ backend
     */
    handleVnPayReturn(params) {
        return axiosClient.get("/payments/vnpay-return", {params});
    }
};