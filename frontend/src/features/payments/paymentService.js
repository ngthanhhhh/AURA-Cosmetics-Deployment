import { paymentApi } from "./paymentApi";

/**
 * paymentService chứa các hàm nghiệp vụ phía frontend liên quan đến thanh toán.
 *
 * File này gọi paymentApi để gửi request đến backend,
 * sau đó lấy response.data trả về cho component sử dụng.
 */
export const paymentService = {
    /**
     * Tạo URL thanh toán VNPay cho một đơn hàng.
     * 
     * @param orderId ID của đơn hàng cần thanh toán
     * @returns Dữ liệu backend trả về
     */
    async createVnPayPayment(orderId) {
        const response = await paymentApi.createVnPayPayment(orderId); // Gọi API tạo URL thanh toán VNPay.
        return response.data; // Trả về phần data từ response để component dùng trực tiếp.
    },

    /**
     * Xử lý kết quả thanh toán VNPay trả về sau khi người dùng thanh toán.
     *
     * Hàm này nhận các tham số trên URL redirect từ VNPay,
     * gửi về backend để backend xác thực chữ ký và cập nhật trạng thái thanh toán.
     *
     * @param params Các tham số VNPay trả về trên URL
     *
     * @returns Kết quả xử lý thanh toán từ backend
     */
    async handleVnPayReturn(params) {
        const response = await paymentApi.handleVnPayReturn(params); // Gọi API xử lý kết quả VNPay trả về.
        return response.data; // Trả về message/kết quả từ backend.
    }
};