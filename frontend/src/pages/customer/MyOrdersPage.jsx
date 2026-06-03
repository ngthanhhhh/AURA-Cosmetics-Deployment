import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../../features/orders/orderService";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import "./MyOrdersPage.css";

function MyOrdersPage() {
    const [orders, setOrders] = useState([]); // State lưu danh sách đơn hàng của người dùng.
    const [keyword, setKeyword] = useState(""); // State lưu từ khóa tìm kiếm.
    const [status, setStatus] = useState("");
    const [sortBy, setSortBy] = useState("createdAt"); // State lưu trường dùng để sắp xếp.
    const [sortDir, setSortDir] = useState("desc"); // State lưu chiều sắp xếp: asc hoặc desc.

    const [page, setPage] = useState(0); // State lưu trang hiện tại, bắt đầu từ 0.

    // State lưu số lượng đơn hàng trên mỗi trang.
    // Ở đây chỉ dùng set cố định là 10 nên không cần setter.
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0); // State lưu tổng số trang backend trả về.
    const [totalElements, setTotalElements] = useState(0); // State lưu tổng số đơn hàng phù hợp với điều kiện lọc/tìm kiếm.

    const [loading, setLoading] = useState(false); // State kiểm tra trang có đang tải dữ liệu hay không.
    const [error, setError] = useState(""); // State lưu thông báo lỗi khi tải danh sách đơn hàng thất bại.

    /**
     * Gọi API lấy danh sách đơn hàng của người dùng hiện tại.
     *
     * Request gửi lên backend gồm:
     * - page, size để phân trang
     * - keyword để tìm kiếm
     * - status để lọc trạng thái
     * - sortBy, sortDir để sắp xếp
     */
    const fetchOrders = async () => {
        try {
            // Bật trạng thái loading và xóa lỗi cũ.
            setLoading(true);
            setError("");

            const data = await orderService.getMyOrders({ // Gọi service lấy đơn hàng của người dùng hiện tại.
                page,
                size,
                keyword: keyword.trim() || undefined,
                status: status || undefined,
                sortBy,
                sortDir
            });

            setOrders(data?.content || []); // Lưu danh sách đơn hàng của trang hiện tại.
            setTotalPages(data?.totalPages || 0); // Lưu tổng số trang.
            setTotalElements(data?.totalElements || 0); // Lưu tổng số đơn hàng.
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

    /**
     * Tự động tải lại danh sách đơn hàng khi page, status,
     * sortBy hoặc sortDir thay đổi.
     */
    useEffect(() => {
        fetchOrders();
    }, [page, status, sortBy, sortDir]);

    /**
     * Xử lý khi submit form tìm kiếm.
     *
     * Reset về trang đầu tiên và gọi lại API lấy danh sách đơn hàng.
     *
     * @param event Sự kiện submit form
     */
    const handleSearchSubmit = (event) => {
        event.preventDefault(); // Ngăn form reload lại trang.
        setPage(0); // Khi tìm kiếm mới thì quay về trang đầu tiên.
        fetchOrders(); // Gọi lại API với keyword hiện tại.
    };

    const handleReset = () => {
        setKeyword("");
        setStatus("");
        setSortBy("createdAt");
        setSortDir("desc");
        setPage(0);
    };

    /**
     * Chuyển mã trạng thái đơn hàng thành nhãn tiếng Việt để hiển thị.
     *
     * @param orderStatus Trạng thái đơn hàng dạng enum/string từ backend
     * @returns Nhãn trạng thái tiếng Việt
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

        // Nếu trạng thái không có trong labels thì hiển thị trực tiếp giá trị backend trả về.
        return labels[orderStatus] || orderStatus;
    };

    return (
        <div className="my-orders-page">
            {/* Header của trang: tiêu đề + link quay lại mua sắm */}
            <div className="my-orders-page__header">
                <h2>Đơn hàng của tôi</h2>
                <Link to="/products">Tiếp tục mua sắm</Link>
            </div>

            {/* Form tìm kiếm, lọc và sắp xếp đơn hàng */}
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
                            setPage(0); // Khi đổi trạng thái lọc thì quay về trang đầu tiên.
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

                {/* Chọn trường dùng để sắp xếp */}
                <div className="my-orders-page__filter-group">
                    <label>Sắp xếp theo</label>
                    <select
                        value={sortBy}
                        onChange={(event) => {
                            setSortBy(event.target.value);
                            setPage(0); // Khi đổi kiểu sắp xếp thì quay về trang đầu tiên.
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

            {/* Nếu đang loading thì hiển thị trạng thái tải dữ liệu */}
            {loading ? (
                <p>Đang tải danh sách đơn hàng...</p>
            ) : orders.length === 0 ? (
                // Nếu không có đơn hàng thì hiển thị trạng thái rỗng.
                <div className="my-orders-page__empty">
                    <p>Bạn chưa có đơn hàng nào hoặc không có đơn hàng phù hợp.</p>
                </div>
            ) : (
                <>
                    <div className="my-orders-page__summary">
                        Tổng số đơn hàng: <strong>{totalElements}</strong>
                    </div>

                    {/* Bảng danh sách đơn hàng */}
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
                                {/* Render từng đơn hàng thành một dòng trong bảng */}
                                {orders.map((order) => (
                                    <tr key={order.orderId}>
                                        <td>#{order.orderId}</td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        <td>{order.recipientName}</td>
                                        <td>{order.recipientPhone}</td>
                                        <td>{formatCurrency(order.totalPrice)}</td>
                                        <td>
                                            {/* Hiển thị trạng thái đơn hàng với class riêng theo status */}
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

                    {/* Phân trang danh sách đơn hàng */}
                    <div className="my-orders-page__pagination">
                        <button
                            type="button"
                            disabled={page <= 0} // Không cho bấm nếu đang ở trang đầu tiên.
                            onClick={() => setPage((prev) => prev - 1)} // Lùi về trang trước.
                        >
                            Trang trước
                        </button>

                        {/* Hiển thị trang hiện tại. Vì page bắt đầu từ 0 nên hiển thị page + 1 */}
                        <span>
                            Trang {page + 1} / {totalPages || 1}
                        </span>

                        <button
                            type="button"
                            disabled={page + 1 >= totalPages} // Không cho bấm nếu đang ở trang cuối.
                            onClick={() => setPage((prev) => prev + 1)} // Chuyển sang trang sau.
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