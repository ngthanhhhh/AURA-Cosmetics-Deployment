package com.cosmetics.ecommerce.service;

import java.util.Map;

/**
 * Service định nghĩa các nghiệp vụ liên quan đến thanh toán VNPay.
 */
public interface PaymentService {
    /**
     * Tạo URL thanh toán VNPay cho một đơn hàng.
     *
     * Quy trình chính:
     * - Kiểm tra người dùng có quyền thanh toán đơn hàng
     * - Kiểm tra phương thức thanh toán là VNPay
     * - Tạo mã giao dịch txnRef
     * - Build bộ tham số gửi sang VNPay
     * - Ký dữ liệu bằng HMAC SHA512
     * - Trả về URL để frontend redirect người dùng sang VNPay
     *
     * @param userId    ID người dùng đang thực hiện thanh toán
     * @param orderId   ID đơn hàng cần thanh toán
     * @param ipAddress Địa chỉ IP của người dùng thực hiện thanh toán
     * @return URL thanh toán VNPay
     */
    String createVnPayPaymentUrl(Integer userId, Integer orderId, String ipAddress);

    /**
     * Xử lý dữ liệu VNPay trả về sau khi người dùng thanh toán.
     *
     * Quy trình chính:
     * - Nhận toàn bộ params VNPay redirect về
     * - Xác thực chữ ký để đảm bảo dữ liệu không bị chỉnh sửa
     * - Tìm Payment theo mã giao dịch txnRef
     * - Cập nhật trạng thái thanh toán SUCCESS hoặc FAILED
     * - Nếu thanh toán thành công thì cập nhật đơn hàng sang PREPARING
     *
     * @param params Map chứa toàn bộ tham số VNPay trả về
     * @return Thông báo kết quả xử lý thanh toán
     */
    String handleVnPayReturn(Map<String, String> params);
}
