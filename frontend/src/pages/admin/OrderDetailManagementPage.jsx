import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { orderService } from "../../features/orders/orderService";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import "./OrderDetailManagementPage.css";

import { notify } from "../../utils/notify";
import { confirmDelete } from "../../utils/confirm";


/**
 * Trang Admin xem và quản lý chi tiết một đơn hàng.
 *
 * Component này hỗ trợ:
 * - Lấy orderId từ URL
 * - Gọi API lấy chi tiết đơn hàng phía Admin
 * - Hiển thị thông tin đơn hàng, người nhận, thanh toán và sản phẩm
 * - Cho phép Admin cập nhật trạng thái đơn hàng
 * - Cho phép Admin xác nhận thanh toán COD
 */
function OrderDetailManagementPage() {
    // Lấy orderId từ URL.
    // Ví dụ: /admin/orders/5 thì orderId = 5.
    const {orderId} = useParams();

    // State lưu chi tiết đơn hàng.
    const [order, setOrder] = useState(null);
    // State lưu trạng thái mới mà Admin chọn để cập nhật.
    const [selectedStatus, setSelectedStatus] = useState("");

    const [loading, setLoading] = useState(false); // State kiểm tra trang có đang tải dữ liệu hay không.
    const [updating, setUpdating] = useState(false); // State kiểm tra có đang cập nhật trạng thái/thanh toán hay không.
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    /**
     * Gọi API lấy chi tiết đơn hàng phía Admin.
     */
    const fetchOrderDetail = async () => {
        try {
            // Bật loading và xóa thông báo cũ.
            setLoading(true);
            setError("");
            setSuccessMessage("");

            // Gọi service lấy chi tiết đơn hàng theo orderId.
            const data = await orderService.getAdminOrderDetail(orderId);
            setOrder(data); // Lưu dữ liệu đơn hàng vào state.
            setSelectedStatus(""); // Reset trạng thái được chọn sau khi tải lại dữ liệu.
        } catch (err) {
            console.error("Fetch admin order detail error: ", err);

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
     * Tính danh sách trạng thái tiếp theo mà Admin được phép chuyển.
     *
     * useMemo giúp chỉ tính lại khi status, paymentMethod hoặc paymentStatus thay đổi,
     * tránh tính lại không cần thiết ở mỗi lần render.
     */
    const availableNextStatuses = useMemo(() => {
        if (!order?.status) { // Nếu chưa có trạng thái đơn hàng thì không có trạng thái tiếp theo.
            return [];
        }

        // Quy định luồng chuyển trạng thái hợp lệ của đơn hàng.
        const transitionMap = {
            PENDING: ["PREPARING", "CANCELLED"],
            PREPARING: ["SHIPPING", "CANCELLED"],
            SHIPPING: ["DELIVERED"],
            DELIVERED: ["COMPLETED"],
            COMPLETED: [],
            CANCELLED: []
        };

        // Lấy danh sách trạng thái tiếp theo dựa trên trạng thái hiện tại.
        const baseStatuses = transitionMap[order.status] || [];

        // Nếu đơn thanh toán VNPay nhưng chưa thanh toán thành công,
        // thì Admin chỉ được phép hủy đơn, không được chuyển sang xử lý/giao hàng.
        if (order.paymentMethod === "VNPAY" && order.paymentStatus !== "SUCCESS") {
            return baseStatuses.filter((status) => status === "CANCELLED");
        }

        return baseStatuses; // Trả về danh sách trạng thái hợp lệ.
    }, [order?.status, order?.paymentMethod, order?.paymentStatus]);

    /**
     * Chuyển mã trạng thái đơn hàng sang nhãn tiếng Việt.
     *
     * @param status Trạng thái đơn hàng từ backend
     * @returns Nhãn trạng thái tiếng Việt
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
        return labels[status] || status;
    };

    /**
     * Chuyển mã trạng thái thanh toán sang nhãn tiếng Việt.
     *
     * @param status Trạng thái thanh toán từ backend
     * @returns Nhãn trạng thái thanh toán tiếng Việt
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
     * Chuyển mã phương thức thanh toán sang nhãn tiếng Việt.
     *
     * @param method Phương thức thanh toán từ backend
     * @returns Nhãn phương thức thanh toán tiếng Việt
     */
    const getPaymentMethodLabel = (method) => {
        const labels = {
            COD: "Thanh toán khi nhận hàng",
            VNPAY: "Thanh toán qua VNPay"
        };
        return labels[method] || method;
    };

    /**
     * Xử lý cập nhật trạng thái đơn hàng.
     */
    const handleUpdateStatus = async () => {
        // Nếu Admin chưa chọn trạng thái mới thì báo lỗi.
        if (!selectedStatus) {
            setError("Vui lòng chọn trạng thái mới!");
            return;
        }

        // Hiển thị hộp thoại xác nhận trước khi cập nhật.
        const confirmUpdate = await confirmDelete(
            "Cập nhật trạng thái đơn hàng",
            `Bạn có chắc muốn chuyển đơn hàng sang trạng thái "${getStatusLabel(selectedStatus)}" không?`
        );


        if (!confirmUpdate) return;

        try {
            // Bật trạng thái updating và xóa thông báo cũ.
            setUpdating(true);
            setError("");
            setSuccessMessage("");

            // Gọi API cập nhật trạng thái đơn hàng.
            const result = await orderService.updateAdminOrderStatus(
                order.orderId,
                selectedStatus
            );

            setSuccessMessage(result?.message || "Cập nhật trạng thái thành công!");

            // Gọi lại API lấy chi tiết đơn hàng mới nhất sau khi cập nhật.
            const newDetail = await orderService.getAdminOrderDetail(order.orderId);
            setOrder(newDetail); // Cập nhật lại dữ liệu đơn hàng trên giao diện.
            setSelectedStatus(""); // Reset trạng thái đang chọn.
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

    /**
     * Xử lý xác nhận thanh toán COD.
     *
     * Dùng cho trường hợp đơn hàng thanh toán khi nhận hàng,
     * sau khi Admin xác nhận khách đã thanh toán thành công.
     */
    const handleConfirmCodPayment = async () => {
        const confirmUpdate = window.confirmDelete(
            "Xác nhận đơn COD này đã thanh toán thành công?"
        );

        if (!confirmUpdate) return;
        try {
            setUpdating(true); // Bật trạng thái updating và xóa thông báo cũ.
            setError("");
            setSuccessMessage("");

            await orderService.confirmCodPayment(order.orderId); // Gọi API xác nhận thanh toán COD.

            setSuccessMessage("Xác nhận thanh toán COD thành công!");

            // Gọi lại API lấy chi tiết đơn hàng mới nhất.
            const newDetail = await orderService.getAdminOrderDetail(order.orderId);
            setOrder(newDetail);  // Cập nhật lại dữ liệu đơn hàng trên giao diện.
        } catch (err){
            console.error("Confirm COD payment error: ", err);

            setError(err?.response?.data?.message || "Không thể xác nhận thanh toán COD. Vui lòng thử lại sau!");
        } finally {
            setUpdating(false);
        }
    }

    if (loading) { // Nếu đang tải dữ liệu thì hiển thị loading.
        return (
            <div className="admin-order-detail-page">
                <p>Đang tải chi tiết đơn hàng...</p>
            </div>
        );
    }

    if (error && !order) { // Nếu có lỗi và chưa có dữ liệu order thì hiển thị lỗi toàn trang.
        return (
            <div className="admin-order-detail-page">
                <div className="admin-order-detail-page__error">{error}</div>
                <Link to="/admin/orders">Quay lại danh sách đơn hàng</Link>
            </div>
        );
    }

    if (!order) { // Nếu không tìm thấy đơn hàng thì hiển thị thông báo.
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

            {/* Grid chứa 3 card thông tin chính: đơn hàng, người nhận, thanh toán */}
            <div className="admin-order-detail-page__grid">
                {/* Card thông tin đơn hàng */}
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

                     {/* Chỉ hiển thị tên khách hàng nếu backend có trả về */}
                    {order.customerName && (
                        <p>
                            <span>Khách hàng:</span> <strong>{order.customerName}</strong>
                        </p>
                    )}
                </section>

                {/* Card thông tin người nhận hàng */}
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

                            {/* Chỉ hiển thị mã giao dịch nếu có*/}
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

                            {/* 
                                Nút xác nhận thanh toán COD chỉ hiện khi:
                                - Phương thức thanh toán là COD
                                - Trạng thái thanh toán còn PENDING
                                - Đơn hàng đã giao đến khách hàng
                            */}
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
                            {/* Render danh sách trạng thái tiếp theo được phép chuyển */}
                            {availableNextStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {getStatusLabel(status)}
                                </option>
                            ))}
                        </select>

                        {/* Nút cập nhật trạng thái */}
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

            {/* Card danh sách sản phẩm trong đơn hàng */}
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
                            {/* Render từng sản phẩm trong đơn hàng thành một dòng */}
                            {(order.items || []).map((item) => (
                                <tr key={item.orderItemId}>
                                    <td>
                                        {/* Tên sản phẩm được lưu lại tại thời điểm đặt hàng */}
                                        <div className="admin-order-detail-page__product-name">
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