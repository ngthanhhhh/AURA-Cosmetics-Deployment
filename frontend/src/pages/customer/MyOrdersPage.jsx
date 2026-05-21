import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../../features/orders/orderService";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import "./MyOrdersPage.css";

function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortDir, setSortDir] = useState("desc");

    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await orderService.getMyOrders({
                page,
                size,
                keyword: keyword.trim() || undefined,
                status: status || undefined,
                sortBy,
                sortDir
            });

            setOrders(data?.content || []);
            setTotalPages(data?.totalPages || 0);
            setTotalElements(data?.totalElements || 0);
        } catch (err) {
            console.error("Fetch my orders error:", err);

            setError(
                err?.response?.data?.message || 
                "Không thể tải danh sách đơn hàng. Vui lòng thử lại sau."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, status, sortBy, sortDir]);

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setPage(0);
        fetchOrders();
    };

    const handleReset = () => {
        setKeyword("");
        setStatus("");
        setSortBy("createdAt");
        setSortDir("desc");
        setPage(0);
    };

    const getStatusLabel = (orderStatus) => {
        const labels = {
            PENDING: "Chờ xử lý",
            PREPARING: "Đang chuẩn bị",
            SHIPPING: "Đang giao",
            DELIVERED: "Đã giao",
            COMPLETED: "Hoàn thành",
            CANCELLED: "Đã hủy"
        };

        return labels[orderStatus] || orderStatus;
    };

    return (
        <div className="my-orders-page">
            <div className="my-orders-page__header">
                <h2>Đơn hàng của tôi</h2>
                <Link to="/products">Tiếp tục mua sắm</Link>
            </div>

            <form className="my-orders-page__filters" onSubmit={handleSearchSubmit}>
                <div className="my-orders-page__filter-group">
                    <label>Tìm kiếm</label>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="Tên, số điện thoại hoặc địa chỉ nhận hàng"
                    />
                </div>

                <div className="my-orders-page__filter-group">
                    <label>Trạng thái</label>
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

                <div className="my-orders-page__filter-group">
                    <label>Sắp xếp theo</label>
                    <select
                        value={sortBy}
                        onChange={(event) => {
                            setSortBy(event.target.value);
                            setPage(0);
                        }}
                    >
                        <option value="createdAt">Ngày đặt hàng</option>
                        <option value="totalPrice">Tổng tiền</option>
                        <option value="status">Trạng thái</option>
                        <option value="orderId">Mã đơn hàng</option>
                    </select>
                </div>

                <div className="my-orders-page__filter-group">
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

                <div className="my-orders-page__filter-actions">
                    <button type="submit">Tìm kiếm</button>
                    <button type="button" onClick={handleReset}>
                        Đặt lại
                    </button>
                </div>
            </form>

            {error && <div className="my-orders-page__error">{error}</div>}

            {loading ? (
                <p>Đang tải danh sách đơn hàng...</p>
            ) : orders.length === 0 ? (
                <div className="my-orders-page__empty">
                    <p>Bạn chưa có đơn hàng nào hoặc không có đơn hàng phù hợp.</p>
                </div>
            ) : (
                <>
                    <div className="my-orders-page__summary">
                        Tổng số đơn hàng: <strong>{totalElements}</strong>
                    </div>

                    <div className="my-orders-page__table-wrapper">
                        <table className="my-orders-page__table">
                            <thead>
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>Ngày đặt</th>
                                    <th>Người nhận</th>
                                    <th>Số điện thoại</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.orderId}>
                                        <td>#{order.orderId}</td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        <td>{order.recipientName}</td>
                                        <td>{order.recipientPhone}</td>
                                        <td>{formatCurrency(order.totalPrice)}</td>
                                        <td>
                                            <span className={`my-orders-page__status status-${order.status}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>

                                        <td>
                                            <Link
                                                to={`/my-orders/${order.orderId}`}
                                                className="my-orders-page__detail-link"
                                            >
                                                Xem chi tiết
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="my-orders-page__pagination">
                        <button
                            type="button"
                            disabled={page <= 0}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            Trang trước
                        </button>

                        <span>
                            Trang {page + 1} / {totalPages || 1}
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

export default MyOrdersPage;