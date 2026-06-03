import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import "./OrderDetailPage.css";
import { orderService } from "../../features/orders/orderService";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";

/**
 * Trang chi tiết đơn hàng của khách hàng.
 *
 * Component này:
 * - Lấy orderId từ URL
 * - Gọi API lấy chi tiết đơn hàng
 * - Hiển thị thông tin đơn hàng, người nhận, thanh toán
 * - Hiển thị danh sách sản phẩm trong đơn
 * - Cho phép quay lại danh sách đơn hàng
 */
function OrderDetailPage() {
    // Lấy orderId từ params trên URL.
    // Ví dụ URL /my-orders/5 thì orderId = 5.
    const {orderId} = useParams();

    // State lưu thông tin chi tiết đơn hàng.
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false); // State kiểm tra có đang tải dữ liệu hay không.
    const [error, setError] = useState(""); // State lưu lỗi khi gọi API thất bại.

    const fetchOrderDetail = async () => {
        try {
            // Bật loading và xóa lỗi cũ trước khi gọi API.
            setLoading(true);
            setError("");

            // Gọi service lấy chi tiết đơn hàng của khách hàng hiện tại.
            const data = await orderService.getMyOrderDetail(orderId);
            
            // Lưu dữ liệu đơn hàng vào state.
            setOrder(data);
        } catch (err) {
            console.error("Fetch order detail error: ", err);

            setError(
                err?.response?.data?.message || "Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau."
            );
        } finally {
            setLoading(false);
        }
    };

    /**
     * Tự động tải chi tiết đơn hàng khi component render
     * hoặc khi orderId trên URL thay đổi.
     */
    useEffect(() => {
        fetchOrderDetail();
    }, [orderId]);

    /**
     * Chuyển trạng thái đơn hàng từ mã enum sang nhãn tiếng Việt.
     *
     * @param status Trạng thái đơn hàng từ backend
     * @returns Tên trạng thái hiển thị cho người dùng
     */
    const getStatusLabel = (status) => {
        const labels = {
            PENDING: "Chờ xử lý",
            PREPARING: "Đang chuẩn bị",
            SHIPPING: "Đang giao",
            DELIVERED: "Đã giao",
            COMPLETED: "Hoàn thành",
            CANCELLED: "Đã hủy"
        };
        return labels[status] || status; // Nếu status không có trong danh sách thì hiển thị lại giá trị gốc.
    };

    /**
     * Chuyển trạng thái thanh toán từ mã enum sang nhãn tiếng Việt.
     *
     * @param status Trạng thái thanh toán từ backend
     * @returns Tên trạng thái thanh toán hiển thị cho người dùng
     */
    const getPaymentStatusLabel = (status) => {
        const labels = {
            PENDING: "Chờ thanh toán",
            SUCCESS: "Thanh toán thành công",
            FAILED: "Thanh toán thất bại"
        };
        return labels[status] || status;
    };

    /**
     * Chuyển phương thức thanh toán từ mã enum sang nhãn tiếng Việt.
     *
     * @param method Phương thức thanh toán từ backend
     * @returns Tên phương thức thanh toán hiển thị cho người dùng
     */
    const getPaymentMethodLabel = (method) => {
        const labels = {
            COD: "Thanh toán khi nhận hàng",
            VNPAY: "Thanh toán qua VNPay"
        };
        return labels[method] || method;
    };

    if (loading) {
        return (
            <div className="order-detail-page">
                <p>Đang tải chi tiết đơn hàng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-detail-page">
                <div className="order-detail-page__error">{error}</div>
                <Link to="/my-orders">Quay lại danh sách đơn hàng</Link>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="order-detail-page">
                <p>Không tìm thấy thông tin đơn hàng.</p>
                <Link to="/my-orders">Quay lại danh sách đơn hàng</Link>
            </div>
        );
    }

    return (
        <div className="order-detail-page">
            <div className="order-detail-page__header">
                <div>
                    <h2>Chi tiết đơn hàng #{order.orderId}</h2>
                    <p>Ngày đặt: {formatDate(order.createdAt)}</p>
                </div>
                
                <Link to="/my-orders">Quay lại danh sách</Link>
            </div>

            {/* Grid hiển thị các nhóm thông tin chính của đơn hàng */}
            <div className="order-detail-page__grid">
                {/* Card thông tin đơn hàng */}
                <section className="order-detail-page__card">
                    <h3>Thông tin đơn hàng</h3>

                    <p>
                        <span>Trạng thái:</span>{" "}
                        <strong>{getStatusLabel(order.status)}</strong>
                    </p>

                    <p>
                        <span>Tổng giá trị:</span>{" "}
                        <strong>{formatCurrency(order.totalPrice)}</strong>
                    </p>

                    {/* Chỉ hiển thị tên khách hàng nếu backend có trả về */}
                    {order.customerName && (
                        <p>
                            <span>Khách hàng:</span> <strong>{order.customerName}</strong>
                        </p>
                    )}
                </section>

                {/* Card thông tin người nhận */}
                <section className="order-detail-page__card">
                    <h3>Thông tin người nhận</h3>

                    <p>
                        <span>Họ tên:</span> <strong>{order.recipientName}</strong>
                    </p>

                    <p>
                        <span>Số điện thoại:</span> <strong>{order.recipientPhone}</strong>
                    </p>

                    <p>
                        <span>Địa chỉ:</span> <strong>{order.shippingAddress}</strong>
                    </p>
                </section>

                {/* Card thông tin thanh toán */}
                <section className="order-detail-page__card">
                    <h3>Thông tin thanh toán</h3>

                    {/* Nếu đơn hàng có thông tin thanh toán thì hiển thị chi tiết payment */}
                    {order.hasPayment ? (
                        <>
                            <p>
                                <span>Phương thức:</span>{" "}
                                <strong>{getPaymentMethodLabel(order.paymentMethod)}</strong>
                            </p>

                            <p>
                                <span>Trạng thái:</span>{" "}
                                <strong>{getPaymentStatusLabel(order.paymentStatus)}</strong>
                            </p>

                            <p>
                                <span>Số tiền:</span>{" "}
                                <strong>{formatCurrency(order.paymentAmount)}</strong>
                            </p>

                            {/* Chỉ hiển thị mã giao dịch nếu có, thường dùng cho VNPay */}
                            {order.transactionNo && (
                                <p>
                                    <span>Mã giao dịch:</span> <strong>{order.transactionNo}</strong>
                                </p>
                            )}

                            {/* Chỉ hiển thị thời gian thanh toán nếu có */}
                            {order.paymentDate && (
                                <p>
                                    <span>Thời gian thanh toán:</span>{" "}
                                    <strong>{formatDate(order.paymentDate)}</strong>
                                </p>
                            )}
                        </>
                    ) : (
                        <p>{order.paymentMessage || "Chưa có thông tin thanh toán."}</p>
                    )}
                </section>
            </div>

            {/* Card danh sách sản phẩm trong đơn hàng */}
            <section className="order-detail-page__items-card">
                <h3>Danh sách sản phẩm</h3>

                <div className="order-detail-page__table-wrapper">
                    <table className="order-detail-page__table">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Đơn giá lúc mua</th>
                                <th>Thành tiền</th>
                                <th>Ghi chú</th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* Render từng sản phẩm trong đơn hàng thành một dòng */}
                            {(order.items || []).map((item) => (
                                <tr key={item.orderItemId}>
                                    <td>
                                        {/* Tên sản phẩm được lưu tại thời điểm đặt hàng */}
                                        <div className="order-detail-page__product-name">
                                            {item.productName}
                                        </div>
                                        {/* Nếu sản phẩm còn tồn tại và chưa ngừng kinh doanh thì cho xem chi tiết */}
                                        {item.productId && !item.discontinued && (
                                            <Link to={`/products/${item.productId}`}>Xem sản phẩm</Link>
                                        )}
                                    </td>
                                    <td>{item.quantity}</td>
                                    <td>{formatCurrency(item.price)}</td>
                                    <td>{formatCurrency(item.subTotal)}</td>
                                    <td>
                                        {/* Nếu sản phẩm đã ngừng kinh doanh thì hiển thị ghi chú phù hợp */}
                                        {item.discontinued
                                        ? item.note || "Sản phẩm này hiện đã ngừng kinh doanh."
                                        : item.note || "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default OrderDetailPage;