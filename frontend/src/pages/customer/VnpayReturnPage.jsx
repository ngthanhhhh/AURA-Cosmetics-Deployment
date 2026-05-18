import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { paymentService } from "../../features/payments/paymentService";
import "./VnpayReturnPage.css";

function VnpayReturnPage() {
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const handleVnPayReturn = async () => {
            try {
                setLoading(true);

                const searchParams = new URLSearchParams(location.search);
                const params = Object.fromEntries(searchParams.entries());

                const result = await paymentService.handleVnPayReturn(params);

                const responseMessage = result?.message || "Đã xử lý kết quả thanh toán.";

                const isSuccess =
                    params.vnp_ResponseCode === "00" ||
                    responseMessage.toLowerCase().includes("thành công") ||
                    responseMessage.toLowerCase().includes("đã được cập nhật trước đó");

                setMessage(responseMessage);
                setSuccess(isSuccess);
            } catch (error) {
                console.error("VNPay return error:", error);

                setSuccess(false);
                setMessage(
                    error?.response?.data?.message || "Không thể xử lý kết quả thanh toán. Vui lòng thử lại sau!"
                );
            } finally {
                setLoading(false);
            }
        };

        handleVnPayReturn();
    }, [location.search]);

    if (loading) {
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
            <div className={`vnpay-return-card ${success ? "success" : "failed"}`}>
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