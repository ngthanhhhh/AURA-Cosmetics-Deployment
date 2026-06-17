import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./OrderManagementPage.css";
import { orderService } from "../../features/orders/orderService";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

/**
 * Trang Admin quản lý danh sách đơn hàng.
 *
 * Component này hỗ trợ:
 * - Lấy danh sách đơn hàng từ backend
 * - Tìm kiếm theo từ khóa
 * - Lọc theo trạng thái đơn hàng
 * - Lọc theo phương thức thanh toán
 * - Lọc theo trạng thái thanh toán
 * - Sắp xếp và phân trang danh sách đơn hàng
 */
function OrderManagementPage() {
    // State lưu danh sách đơn hàng hiện tại.
    const [orders, setOrders] = useState([]);

    // State lưu từ khóa tìm kiếm.
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState(""); // State lưu trạng thái đơn hàng cần lọc.
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortDir, setSortDir] = useState("desc");

    const [page, setPage] = useState(0); // State lưu trang hiện tại, bắt đầu từ 0.

    // State lưu số lượng đơn hàng trên mỗi trang.
    // Ở đây cố định là 10 nên không cần setter.
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0); // State lưu tổng số trang backend trả về.
    const [totalElements, setTotalElements] = useState(0); // State lưu tổng số đơn hàng phù hợp với điều kiện lọc/tìm kiếm.

    const [loading, setLoading] = useState(false); // State kiểm tra trang có đang tải dữ liệu hay không.
    const [error, setError] = useState(""); // State lưu thông báo lỗi khi gọi API thất bại.

    /**
     * Gọi API lấy danh sách đơn hàng phía Admin.
     *
     * Request gửi lên backend gồm:
     * - page, size để phân trang
     * - keyword để tìm kiếm
     * - status để lọc trạng thái đơn hàng
     * - paymentMethod để lọc phương thức thanh toán
     * - paymentStatus để lọc trạng thái thanh toán
     * - sortBy, sortDir để sắp xếp
     */
    const fetchOrders = async () => {
        try {
            setLoading(true); // Bật loading và xóa lỗi cũ.
            setError("");

            // Gọi service lấy danh sách đơn hàng Admin.
            const data = await orderService.getAdminOrders({
                page,
                size,
                keyword: keyword.trim() || undefined, // Nếu keyword sau khi trim là rỗng thì gửi undefined để không lọc keyword.
                status: status || undefined, // Nếu status rỗng thì gửi undefined để lấy tất cả trạng thái.
                paymentMethod: paymentMethod || undefined,
                paymentStatus: paymentStatus || undefined,
                sortBy,
                sortDir
            });

            setOrders(data?.content || []); // Lưu danh sách đơn hàng của trang hiện tại.
            setTotalPages(data?.totalPages || 0); // Lưu tổng số trang.
            setTotalElements(data?.totalElements || 0);  // Lưu tổng số đơn hàng.
        } catch (err) {
            console.error("Fetch admin orders error: ", err);

            setError( // Ưu tiên message từ backend, nếu không có thì dùng lỗi mặc định.
                err?.response?.data?.message ||
                "Không thể tải danh sách đơn hàng. Vui lòng thử lại sau!"
            );
        } finally {
            setLoading(false); // Dù thành công hay lỗi thì cũng tắt loading.
        }
    };

    /**
     * Tự động tải lại danh sách đơn hàng khi:
     * - page thay đổi
     * - trạng thái đơn hàng thay đổi
     * - phương thức thanh toán thay đổi
     * - trạng thái thanh toán thay đổi
     * - kiểu sắp xếp thay đổi
     *
     * keyword không nằm trong dependency để tránh gọi API liên tục khi đang gõ.
     * Tìm kiếm keyword chỉ chạy khi submit form.
     */
    useEffect(() => {
        fetchOrders();
    }, [page, status, paymentMethod, paymentStatus, sortBy, sortDir]);

    /**
     * Xử lý khi Admin submit form tìm kiếm.
     *
     * @param event Sự kiện submit form
     */
    const handleSearchSubmit = (event) => {
        event.preventDefault(); // Ngăn form reload lại trang.
        setPage(0); // Khi tìm kiếm mới thì quay về trang đầu tiên.
        fetchOrders(); // Gọi lại API với keyword hiện tại.
    };

    /**
     * Đặt lại toàn bộ bộ lọc và sắp xếp về mặc định.
     */
    const handleReset = () => {
        setKeyword("");
        setStatus("");
        setPaymentMethod("");
        setPaymentStatus("");
        setSortBy("createdAt");
        setSortDir("desc");
        setPage(0);
    };

    /**
     * Chuyển mã trạng thái đơn hàng từ backend sang nhãn tiếng Việt.
     *
     * @param orderStatus Trạng thái đơn hàng từ backend
     * @returns Nhãn trạng thái tiếng Việt để hiển thị
     */
    const getStatusLabel = (orderStatus) => {
        const labels = {
            PENDING: "Chờ xử lý",
            PREPARING: "Đang chuẩn bị",
            SHIPPING: "Đang giao",
            DELIVERED: "Đã giao",
            COMPLETED: "Hoàn thành",
            CANCELLED: "Đã hủy"
        };

        // Nếu trạng thái không có trong labels thì hiển thị lại giá trị gốc.
        return labels[orderStatus] || orderStatus;
    };

    return (
        <div className="admin-orders-page">
            <div className="admin-orders-page__header">
                <h2>Quản lý đơn hàng</h2>
            </div>

            {/* Form tìm kiếm, lọc và sắp xếp danh sách đơn hàng */}
            <form className="admin-orders-page__filters" onSubmit={handleSearchSubmit}>
                {/* Ô tìm kiếm theo tên, số điện thoại, địa chỉ hoặc email khách hàng */}
                <div className="admin-orders-page__filter-group">
                    <label>Tìm kiếm</label>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="Tên, số điện thoại, địa chỉ, email khách hàng"
                    />
                </div>

                {/* Bộ lọc theo trạng thái đơn hàng */}
                <div className="admin-orders-page__filter-group">
                    <label>Trạng thái đơn</label>
                    <select
                        value={status}
                        onChange={(event) => {
                            setStatus(event.target.value);
                            setPage(0);
                        }}
                    >
                        <option value="">Tất cả</option>
                        <option value="PENDING">Chờ xử lý</option>
                        <option value="PREPARING">Đang chuẩn bị</option>
                        <option value="SHIPPING">Đang giao</option>
                        <option value="DELIVERED">Đã giao</option>
                        <option value="COMPLETED">Hoàn thành</option>
                        <option value="CANCELLED">Đã hủy</option>
                    </select>
                </div>

                <div className="admin-orders-page__filter-group">
                    <label>Phương thức thanh toán</label>
                    <select
                        value={paymentMethod}
                        onChange={(event) => {
                            setPaymentMethod(event.target.value);
                            setPage(0);
                        }}
                    >
                        <option value="">Tất cả</option>
                        <option value="COD">COD</option>
                        <option value="VNPAY">VNPay</option>
                    </select>
                </div>

                <div className="admin-orders-page__filter-group">
                    <label>Trạng thái thanh toán</label>
                    <select
                        value={paymentStatus}
                        onChange={(event) => {
                            setPaymentStatus(event.target.value);
                            setPage(0);
                        }}
                    >
                        <option value="">Tất cả</option>
                        <option value="PENDING">Chờ thanh toán</option>
                        <option value="SUCCESS">Thành công</option>
                        <option value="FAILED">Thất bại</option>
                    </select>
                </div>

                <div className="admin-orders-page__filter-group">
                    <label>Sắp xếp theo</label>
                    <select
                        value={sortBy}
                        onChange={(event) => {
                            setSortBy(event.target.value);
                            setPage(0);
                        }}
                    >
                        <option value="createdAt">Ngày tạo</option>
                        <option value="updatedAt">Ngày cập nhật</option>
                        <option value="totalPrice">Tổng tiền</option>
                        <option value="status">Trạng thái</option>
                        <option value="orderId">Mã đơn</option>
                    </select>
                </div>

                <div className="admin-orders-page__filter-group">
                    <label>Thứ tự</label>
                    <select
                        value={sortDir}
                        onChange={(event) => {
                            setSortDir(event.target.value);
                            setPage(0);
                        }}
                    >
                        <option value="desc">Giảm dần</option>
                        <option value="asc">Tăng dần</option>
                    </select>
                </div>

                <div className="admin-orders-page__filter-actions">
                    <button type="submit">Tìm kiếm</button>
                    <button type="button" onClick={handleReset}>Đặt lại</button>
                </div>
            </form>

            {error && <div className="admin-orders-page__error">{error}</div>}

            {loading ? (
                <p>Đang tải danh sách đơn hàng...</p>
            ) : orders.length === 0 ? (
                <div className="admin-orders-page__empty">
                    <p>Không có đơn hàng phù hợp.</p>
                </div>
            ) : (
                <>
                    <div className="admin-orders-page__summary">
                        Tổng số đơn hàng: <strong>{totalElements}</strong>
                    </div>

                    <div className="admin-orders-page__table-wrapper">
                        <table className="admin-orders-page__table">
                            <thead>
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>Ngày tạo</th>
                                    <th>Người nhận</th>
                                    <th>Số điện thoại</th>
                                    <th>Tổng tiền</th>
                                    <th>Phương thức<br />thanh toán</th>
                                    <th>Trạng thái<br />thanh toán</th>
                                    <th>Trạng thái đơn</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {/* Render từng đơn hàng thành một dòng trong bảng */}
                                {orders.map((order) => (
                                    <tr key={order.orderId}>
                                        <td>#{order.orderId}</td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        <td>{order.recipientName}</td>
                                        <td>{order.recipientPhone}</td>
                                        <td>{formatCurrency(order.totalPrice)}</td>

                                        {/* Badge phương thức thanh toán */}
                                        <td>
                                            <span className={`payment-method-badge payment-method-badge--${order.paymentMethod?.toLowerCase()}`}>
                                                {order.paymentMethod === "COD"
                                                    ? "COD"
                                                    : order.paymentMethod === "VNPAY"
                                                    ? "VNPay"
                                                    : "-"
                                                }
                                            </span>
                                        </td>

                                        {/* Badge trạng thái thanh toán */}
                                        <td>
                                            <span className={`payment-status-badge payment-status-badge--${order.paymentStatus?.toLowerCase()}`}>
                                                {order.paymentStatus === "PENDING"
                                                    ? "Chờ thanh toán"
                                                    : order.paymentStatus === "SUCCESS"
                                                    ? "Thành công"
                                                    : order.paymentStatus === "FAILED"
                                                    ? "Thất bại"
                                                    : "-"
                                                }
                                            </span>
                                        </td>

                                        {/* Badge trạng thái đơn hàng */}
                                        <td>
                                            <span className={`admin-orders-page__status status-${order.status}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>

                                        <td>
                                            <Link
                                                to={`/admin/orders/${order.orderId}`}
                                                className="admin-orders-page__detail-link"
                                            >
                                                Xem chi tiết
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Phân trang danh sách đơn hàng */}
                    <div className="admin-orders-page__pagination">
                        <button
                            type="button"
                            disabled={page <= 0}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            Trang trước
                        </button>

                        <span>
                            Trang {page + 1} / {totalPages || 1} {/* Hiển thị trang hiện tại / tổng số trang */}
                        </span>

                        <button
                            type="button"
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            Trang sau
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default OrderManagementPage;