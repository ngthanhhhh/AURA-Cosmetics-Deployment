package com.cosmetics.ecommerce.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cosmetics.ecommerce.security.CurrentUserProvider;
import com.cosmetics.ecommerce.service.PaymentService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

/**
 * Controller xử lý các API liên quan đến thanh toán VNPay.
 *
 * Bao gồm:
 * - Tạo link thanh toán cho đơn hàng
 * - Nhận kết quả thanh toán từ VNPay trả về sau khi người dùng thanh toán
 *
 */
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    private final CurrentUserProvider currentUserProvider;

    /**
     * Tạo link thanh toán VNPay cho một đơn hàng.
     *
     * API này dùng khi khách hàng chọn thanh toán bằng VNPay.
     * Hệ thống sẽ xác định người dùng hiện tại, lấy orderId từ URL,
     * lấy địa chỉ IP của client, sau đó gọi PaymentService để tạo URL thanh toán.
     *
     * @param authentication Thông tin xác thực của người dùng hiện tại.
     * @param orderId        ID của đơn hàng cần thanh toán.
     * @param request        HttpServletRequest dùng để lấy địa chỉ IP của client.
     * @return ResponseEntity chứa URL thanh toán VNPay.
     */
    @PostMapping("/vnpay/{orderId}")
    public ResponseEntity<Map<String, String>> createVnPayPayment(
        Authentication authentication,
        @PathVariable Integer orderId,
        HttpServletRequest request
    ){
        Integer userId = currentUserProvider.getCurrentUserId(authentication);
        // Lấy IP của client để gửi sang VNPay
        String ipAddress = request.getRemoteAddr();

        // Gọi service tạo URL thanh toán
        String paymentUrl = paymentService.createVnPayPaymentUrl(userId, orderId, ipAddress);

        // Trả về URL thanh toán về cho frontend
        return ResponseEntity.ok(Map.of("paymentUrl", paymentUrl));
    }

    /**
     * Nhận kết quả thanh toán trả về từ VNPay.
     *
     * Sau khi người dùng thanh toán, VNPay sẽ redirect về endpoint này
     * kèm theo các tham số như mã giao dịch, mã phản hồi và chữ ký bảo mật.
     * Service sẽ kiểm tra chữ ký, đối chiếu giao dịch và cập nhật trạng thái thanh toán.
     *
     * @param params Toàn bộ query params do VNPay gửi về.
     * @return ResponseEntity chứa thông báo kết quả xử lý thanh toán.
     */
    @GetMapping("/vnpay-return")
    public ResponseEntity<Map<String, String>> vnpayReturn(
        @RequestParam Map<String, String> params
    ){
        // Gọi Service để xử lý kết quả thanh toán từ VNPay
        String message = paymentService.handleVnPayReturn(params);

        // Trả thông báo kết quả xử lý
        return ResponseEntity.ok(Map.of("message", message));
    }
}
