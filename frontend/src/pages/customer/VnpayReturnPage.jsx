import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { paymentService } from "../../features/payments/paymentService";
import "./VnpayReturnPage.css";

/**
 * Trang xử lý kết quả thanh toán VNPay.
 *
 * Sau khi người dùng thanh toán trên VNPay,
 * VNPay sẽ redirect về trang này kèm các tham số trên URL.
 *
 * Component này:
 * - Lấy query params VNPay trả về từ URL
 * - Gửi params về backend để xác thực chữ ký và cập nhật trạng thái thanh toán
 * - Hiển thị kết quả thanh toán thành công hoặc thất bại
 * - Cho phép người dùng quay về danh sách đơn hàng hoặc tiếp tục mua sắm
 */
function VnpayReturnPage() {
    // Hook lấy thông tin URL hiện tại, bao gồm phần query string sau dấu ?
    const location = useLocation();

    // State kiểm tra trang có đang xử lý kết quả thanh toán hay không.
    const [loading, setLoading] = useState(true);

    // State lưu message kết quả thanh toán để hiển thị cho người dùng.
    const [message, setMessage] = useState("");

    // State xác định thanh toán thành công hay thất bại.
    const [success, setSuccess] = useState(false);

    /**
     * Tự động xử lý kết quả VNPay khi trang được mở
     * hoặc khi query string trên URL thay đổi.
     */
    useEffect(() => {
        /**
         * Xử lý dữ liệu VNPay redirect về.
         *
         * Quy trình:
         * - Lấy toàn bộ params từ URL
         * - Chuyển URLSearchParams thành object thường
         * - Gửi params về backend để xác thực và cập nhật payment/order
         * - Nhận message từ backend
         * - Xác định giao dịch thành công hay thất bại
         */
        const handleVnPayReturn = async () => {
            try {
                // Bật loading trong lúc xử lý kết quả thanh toán.
                setLoading(true);

                // Lấy phần query string sau dấu ? trên URL.
                // Ví dụ: ?vnp_ResponseCode=00&vnp_TxnRef=123
                const searchParams = new URLSearchParams(location.search);
                
                // Chuyển URLSearchParams thành object thường để gửi về backend.
                const params = Object.fromEntries(searchParams.entries());

                // Gửi toàn bộ params VNPay trả về cho backend xử lý.
                const result = await paymentService.handleVnPayReturn(params);

                // Lấy message backend trả về, nếu không có thì dùng message mặc định.
                const responseMessage = result?.message || "Đã xử lý kết quả thanh toán.";

                // Xác định giao dịch có thành công hay không.
                // VNPay trả vnp_ResponseCode = "00" nghĩa là thanh toán thành công.
                // Ngoài ra vẫn kiểm tra message để xử lý trường hợp backend báo đã cập nhật trước đó.
                const isSuccess =
                    params.vnp_ResponseCode === "00" ||
                    responseMessage.toLowerCase().includes("thành công") ||
                    responseMessage.toLowerCase().includes("đã được cập nhật trước đó");

                // Lưu message và trạng thái kết quả để hiển thị lên UI.
                setMessage(responseMessage);
                setSuccess(isSuccess);
            } catch (error) {
                console.error("VNPay return error:", error);

                setSuccess(false); // Nếu có lỗi thì xem như thanh toán/xử lý thất bại.
                setMessage(
                    error?.response?.data?.message || "Không thể xử lý kết quả thanh toán. Vui lòng thử lại sau!"
                );
            } finally {
                setLoading(false);
            }
        };

        handleVnPayReturn(); // Gọi hàm xử lý VNPay return ngay khi effect chạy.
    }, [location.search]);

    if (loading) { // Nếu đang xử lý kết quả thanh toán thì hiển thị màn hình loading.
        return (
            <div className="vnpay-return-page">
                <div className="vnpay-return-card">
                    <div className="vnpay-return-loader"></div>
                    <h2>Đang xử lý thanh toán...</h2>
                    <p>Vui lòng không tắt trang trong lúc hệ thống xác nhận giao dịch.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="vnpay-return-page">
            {/* Card kết quả thanh toán, thêm class success/failed tùy theo trạng thái */}
            <div className={`vnpay-return-card ${success ? "success" : "failed"}`}>
                {/* Icon hiển thị theo kết quả thanh toán */}
                <div className="vnpay-return-icon">{success ? "✓": "!"}</div>

                <h2>{success ? "Thanh toán thành công!" : "Thanh toán thất bại!"}</h2>

                <p>{message}</p>

                <div className="vnpay-return-actions">
                    <Link to="/my-orders" className="vnpay-return-btn primary">
                        Xem đơn hàng của tôi
                    </Link>

                    <Link to="/products" className="vnpay-return-btn secondary">
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default VnpayReturnPage;