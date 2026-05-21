import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { orderService } from "../../features/orders/orderService";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import "./OrderDetailManagementPage.css";

function OrderDetailManagementPage() {
    const {orderId} = useParams();

    const [order, setOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");

    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchOrderDetail = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccessMessage("");

            const data = await orderService.getAdminOrderDetail(orderId);
            setOrder(data);
            setSelectedStatus("");
        } catch (err) {
            console.error("Fetch admin order detail error: ", err);

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

    const availableNextStatuses = useMemo(() => {
        if (!order?.status) {
            return [];
        }

        const transitionMap = {
            PENDING: ["PREPARING", "CANCELLED"],
            PREPARING: ["SHIPPING", "CANCELLED"],
            SHIPPING: ["DELIVERED"],
            DELIVERED: ["COMPLETED"],
            COMPLETED: [],
            CANCELLED: []
        };

        return transitionMap[order.status] || [];
    }, [order?.status]);

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

    const handleUpdateStatus = async () => {
        if (!selectedStatus) {
            setError("Vui lòng chọn trạng thái mới!");
            return;
        }

        const confirmUpdate = window.confirm(
            `Bạn có chắc muốn chuyển đơn hàng sang trạng thái "${getStatusLabel(selectedStatus)}" không?`
        );

        if (!confirmUpdate) return;

        try {
            setUpdating(true);
            setError("");
            setSuccessMessage("");

            const result = await orderService.updateAdminOrderStatus(
                order.orderId,
                selectedStatus
            );

            setSuccessMessage(result?.message || "Cập nhật trạng thái thành công!");

            const newDetail = await orderService.getAdminOrderDetail(order.orderId);
            setOrder(newDetail);
            setSelectedStatus("");
        } catch (err) {
            console.error("Update order status error: ", err);

            setError(
                err?.response?.data?.message ||
                "Cập nhật trạng thái thất bại. Vui lòng thử lại sau!"
            );
        } finally {
            setUpdating(false);
        }
    };

    const handleConfirmCodPayment = async () => {
        const confirmUpdate = window.confirm("Xác nhận đơn COD này đã thanh toán thành công?");

        if (!confirmUpdate) return;
        try {
            setUpdating(true);
            setError("");
            setSuccessMessage("");

            await orderService.confirmCodPayment(order.orderId);

            setSuccessMessage("Xác nhận thanh toán COD thành công!");

            const newDetail = await orderService.getAdminOrderDetail(order.orderId);
            setOrder(newDetail);
        } catch (err){
            console.error("Confirm COD payment error: ", err);

            setError(err?.response?.data?.message || "Không thể xác nhận thanh toán COD. Vui lòng thử lại sau!");
        } finally {
            setUpdating(false);
        }
    }

    if (loading) {
        return (
            <div className="admin-order-detail-page">
                <p>Đang tải chi tiết đơn hàng...</p>
            </div>
        );
    }

    if (error && !order) {
        return (
            <div className="admin-order-detail-page">
                <div className="admin-order-detail-page__error">{error}</div>
                <Link to="/admin/orders">Quay lại danh sách đơn hàng</Link>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="admin-order-detail-page">
                <p>Không tìm thấy thông tin đơn hàng.</p>
                <Link to="/admin/orders">Quay lại danh sách đơn hàng</Link>
            </div>
        );
    }

    return (
        <div className="admin-order-detail-page">
            <div className="admin-order-detail-page__header">
                <div>
                    <h2>Chi tiết đơn hàng #{order.orderId}</h2>
                    <p>Ngày tạo: {formatDate(order.createdAt)}</p>
                </div>

                <Link to="/admin/orders">Quay lại danh sách</Link>
            </div>

            {error && <div className="admin-order-detail-page__error">{error}</div>}


            {successMessage && (
                <div className="admin-order-detail-page__success">{successMessage}</div>
            )}

            <div className="admin-order-detail-page__grid">
                <section className="admin-order-detail-page__card">
                    <h3>Thông tin đơn hàng</h3>

                    <p>
                        <span>Mã đơn:</span> <strong>#{order.orderId}</strong>
                    </p>

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

                <section className="admin-order-detail-page__card">
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

                <section className="admin-order-detail-page__card">
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
                                    <span>Mã giao dịch:</span>{" "}
                                    <strong>{order.transactionNo}</strong>
                                </p>
                            )}

                            {order.paymentDate && (
                                <p>
                                    <span>Thời gian thanh toán:</span>{" "}
                                    <strong>{formatDate(order.paymentDate)}</strong>
                                </p>
                            )}

                            {order.paymentMethod === "COD" && order.paymentStatus === "PENDING" && order.status === "DELIVERED" && (
                                <button
                                    type="button"
                                    onClick={handleConfirmCodPayment}
                                    disabled={updating}
                                    className="admin-order-detail-page__cod-payment-btn"
                                >
                                    {updating ? "Đang xác nhận..." : "Xác nhận đã thanh toán COD"}
                                </button>
                            )}
                        </>
                    ) : (
                        <p>{order.paymentMessage || "Chưa có thông tin thanh toán!"}</p>
                    )}
                </section>
            </div>

            <section className="admin-order-detail-page__card admin-order-detail-page__status-card">
                <h3>Cập nhật trạng thái đơn hàng</h3>

                {availableNextStatuses.length === 0 ? (
                    <p>Đơn hàng đang ở trạng thái kết thúc, không còn trạng thái tiếp theo.</p>
                ) : (
                    <div className="admin-order-detail-page__status-actions">
                        <select
                            value={selectedStatus}
                            onChange={(event) => setSelectedStatus(event.target.value)}
                            disabled={updating}
                        >
                            <option value="">Chọn trạng thái mới</option>
                            {availableNextStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {getStatusLabel(status)}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={handleUpdateStatus}
                            disabled={updating || !selectedStatus}
                        >
                            {updating ? "Đang cập nhật..." : "Cập nhật trạng thái"}
                        </button>
                    </div>
                )}
            </section>

            <section className="admin-order-detail-page__items-card">
                <h3>Danh sách sản phẩm</h3>
                <div className="admin-order-detail-page__table-wrapper">
                    <table className="admin-order-detail-page__table">
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
                                        <div className="admin-order-detail-page__product-name">
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
                                        : item.note || "-"
                                    }
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

export default OrderDetailManagementPage;