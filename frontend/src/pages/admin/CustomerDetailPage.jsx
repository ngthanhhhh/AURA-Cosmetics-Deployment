import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/common/Loading";
import {
    fetchCustomersDetail,
    updateCustomersStatus,
} from "../../features/users/userService";
import "./CustomerDetailPage.css";
import { formatDate } from "../../utils/formatDate";

function CustomerDetailPage() {

    const {customerId} = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /**
     * Tải thông tin chi tiết khách hàng và lịch sử đơn hàng.
     */
    const loadCustomerDetail = async () => {
        setLoading(true);
        setError("");

        try{
            const data = await fetchCustomersDetail(customerId);

            setCustomer(data);
            setOrders(data.orders || data.orderHistory || []);

        } catch (err){
            console.error("Lỗi tải chi tiết khách hàng", err);
            setError("Không thể tải thông tin khách hàng. Vui lòng thử lại sau.")
        } finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomerDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerId]);

    /**
     * Khóa hoặc mở khóa tài khoản khách hàng.
     */ 
    const handleToggleStatus = async () => {
        if (!customer) return;

        const action = customer.isActive ? "khóa" : "mở khóa";

        if(!window.confirm(`Bạn có chắc muốn ${action} tài khoản này không?`)) {
            return;
        }
       
        try{
             
            const customerIdValue = customer?.id;

            if(!customerIdValue){
                alert("Không xác định được ID khách hàng");
                return;
            }

            await updateCustomersStatus(customerIdValue, !customer.isActive); 
            await loadCustomerDetail();  
        } catch (err){
            console.error("Lỗi cập nhật trạng thái:", err);
            alert("Cập nhật trạng thái thất bại, vui lòng thử lại!");
        }
    };

    if(loading){
        return <Loading/>
    }

    if(error){
        return (
            <div className="customer-detail-page">
                <div className="customer-detail-error">
                    <p>{error}</p>
                    <button 
                        type="button"
                        onClick={() => navigate("/admin/customers")}>
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        );
    }

    if (!customer){
        return (
            <div className="customer-detail-page">
                <div className="customer-detail-error">
                    <p>Không tìm thấy thông tin khách hàng</p>
                    <button 
                        type="button"
                        onClick={() => navigate("/admin/customers")}>
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        );
    }

    const registeredDate = formatDate(customer.createdAt);

    const getOrderTotal = (order) => {
    return (
        order.totalAmount ??
        order.totalPrice ??
        order.total ??
        order.finalAmount ??
        order.amount ??
        0
    );
};

    return (
        <div className="customer-detail-page">
            <div className="customer-detail-header">
                <div>
                    <h2>Chi tiết khách hàng</h2>
                    <p>Xem thông tin cá nhân, trạng thái và lịch sử đơn hàng.</p>
                </div>

                <div className="customer-detail-header__actions">
                    <button
                        type="button"
                        className="customer-detail-btn customer-detail-btn--secondary"
                        onClick={() => navigate("/admin/customers")}
                    >
                        Quay lại
                    </button>

                    <button
                        type="button"
                        className={`customer-detail-btn ${
                            customer.isActive
                            ? "customer-detail-btn--danger"
                            : "customer-detail-btn--success"
                        }`}
                        onClick={handleToggleStatus}
                        >
                            {customer.isActive ? "Khoá tài khoản" : "Mở khóa tài khoản"}
                    </button>
                </div>
            </div>

            <div className="customer-detail-grid">
                <section className="customer-profile-card">
                    <div className="customer-profile-top">
                        <div className="customer-profile-avatar">
                            {customer.name?.charAt(0)?.toUpperCase() || "K"}
                        </div>

                        <div className="customer-profile-main">
                            <h3>{customer.name || "-"}</h3>
                            <p>{customer.email || "-"}</p>

                            <span
                                className={`customer-status-badge ${
                                    customer.isActive
                                    ? "customer-detail-badge--active"
                                    : "customer-detail-badge--inactive"
                                }`}
                            >
                                {customer.isActive ? "Hoạt động" : "Đã khóa"}

                            </span>
                        </div>
                    </div>

                    <div className="customer-info-list">
                        <div className="customer-info-item">
                            <span>Email</span>
                            <strong>{customer.email || "-"}</strong>
                        </div>

                        <div className="customer-info-item">
                            <span>Số điện thoại</span>
                            <strong>{customer.phone || "-"}</strong>
                        </div>

                        <div className="customer-info-item">
                            <span>Địa chỉ</span>
                            <strong>{customer.address || "-"}</strong>
                        </div>

                        <div className="customer-info-item">
                            <span>Ngày đăng ký</span>
                            <strong>{registeredDate}
                            </strong>
                        </div>
                    </div>
                </section>

                <section className="customer-orders-card">
                    <div className="customer-section-header">
                        <div>
                            <h3>Lịch sử đơn hàng</h3>
                            <p>{orders.length} đơn hàng</p>
                        </div>
                    </div>
                    
                    {orders.length === 0 ? (
                        <div className="customer-detail-empty">
                            Khách hàng chưa có đơn hàng nào.
                        </div>
                    ) : (
                        <div className="customer-order-table-wrapper">

                            <table className="customer-order-table">
                                <thead>
                                    <tr>
                                        <th>Mã đơn</th>
                                        <th>Ngày đặt</th>
                                        <th>Trạng thái</th>
                                        <th>Tổng tiền</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id || order.orderId}>
                                            <td>
                                                <strong>#{order.id || order.orderId}</strong>
                                            </td>

                                            <td>
                                                    {order.createdAt
                                                        ? formatDate(order.createdAt)
                                                        : "-"
                                                    }
                                            </td>

                                            <td>
                                                <span className="order-status-badge">
                                                    {order.status || "-"}
                                                </span>
                                                
                                            </td>

                                            <td className="order-total">
                                                {Number(getOrderTotal(order) || 0).toLocaleString("vi-VN")}đ
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                            
                        </div>
                    )}

                </section>
            </div>
        </div>
    );
}

export default CustomerDetailPage;