import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import "./OrderDetailPage.css";
import { orderService } from "../../features/orders/orderService";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";

function OrderDetailPage() {
    const {orderId} = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchOrderDetail = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await orderService.getMyOrderDetail(orderId);
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

    useEffect(() => {
        fetchOrderDetail();
    }, [orderId]);

    const getStatusLabel = (status) => {
        const labels = {
            PENDING: "Chờ xử lý",
            PREPARING: "Đang chuẩn bị",
            SHIPPING: "Đang giao",
            DELIVERED: "Đã giao",
            COMPLETED: "Hoàn thành",
            CANCELLED: "Đã hủy"
        };
        return labels[status] || status;
    };

    const getPaymentStatusLabel = (status) => {
        const labels = {
            PENDING: "Chờ thanh toán",
            SUCCESS: "Thanh toán thành công",
            FAILED: "Thanh toán thất bại"
        };
        return labels[status] || status;
    };

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

            <div className="order-detail-page__grid">
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

                    {order.customerName && (
                        <p>
                            <span>Khách hàng:</span> <strong>{order.customerName}</strong>
                        </p>
                    )}
                </section>

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

                <section className="order-detail-page__card">
                    <h3>Thông tin thanh toán</h3>

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

                            {order.transactionNo && (
                                <p>
                                    <span>Mã giao dịch:</span> <strong>{order.transactionNo}</strong>
                                </p>
                            )}

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
                            {(order.items || []).map((item) => (
                                <tr key={item.orderItemId}>
                                    <td>
                                        <div className="order-detail-page__product-name">
                                            {item.productName}
                                        </div>
                                        {item.productId && !item.discontinued && (
                                            <Link to={`/products/${item.productId}`}>Xem sản phẩm</Link>
                                        )}
                                    </td>
                                    <td>{item.quantity}</td>
                                    <td>{formatCurrency(item.price)}</td>
                                    <td>{formatCurrency(item.subTotal)}</td>
                                    <td>
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