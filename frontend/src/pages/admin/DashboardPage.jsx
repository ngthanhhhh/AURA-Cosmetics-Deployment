import { useEffect, useState } from "react";
import { fetchDashboardStatistics } from "../../features/statistics/statisticService";
import Loading from "../../components/common/Loading";
import "./DashboardPage.css";
import { formatCurrency } from "../../utils/formatCurrency";

/**
 * Tải dữ liệu dashboard tổng quan từ backend.
 *
 * Bao gồm:
 * - doanh thu
 * - tổng đơn hàng
 * - tổng khách hàng
 * - trạng thái đơn hàng
 */
function DashboardPage() {

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try{
            setLoading(true);
            setError("");

            const data = await fetchDashboardStatistics();
            setDashboardData(data);
        } catch {
            setError("Không thể tải dữ liệu dashboard.");
        } finally {
            setLoading(false);
        }
    }

    const summaryCards = [
        {
            title: "Tổng doanh thu",
            value: formatCurrency(dashboardData?.totalRevenue),
            desc: "Doanh thu từ đơn hoàn thành",
        },
        {
            title: "Tổng đơn hàng",
            value: dashboardData?.totalOrders || 0,
            desc: "Tất cả đơn hàng trong hệ thống",
        },
        {
            title: "Khách hàng",
            value: dashboardData?.totalUsers || 0,
            desc: "Tổng số tài khoản khách hàng",
        },
        {
            title: "Đơn hoàn thành",
            value: dashboardData?.completedOrders || 0,
            desc: "Đơn đã hoàn thành",
        },
        
    ];

    const orderStatusCards = [
        {
            title: "Chờ xử lý",
            value: dashboardData?.pendingOrders || 0,
        },
        {
            title: "Đang chuẩn bị",
            value: dashboardData?.preparingOrders || 0,
        },
        {
            title: "Đang giao",
            value: dashboardData?.shippingOrders || 0,
        },
        {
            title: "Đã hủy",
            value: dashboardData?.cancelledOrders || 0,
        },
    ];

    if(loading) {
        return <Loading/>;
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-page__header">
                <div>
                    <h2>Dashboard tổng quan</h2>
                    <p>
                        Theo dõi nhanh hoạt động kinh doanh của cửa hàng

                    </p>
                </div>
            </div>

            {error && <p className="dashboard-error">{error}</p>}

            <div className="dashboard-summary">
                {summaryCards.map((item) => (
                    <div className="dashboard-card" key={item.title}>
                        <p>{item.title}</p>
                        <h3>{item.value}</h3>
                        <span>{item.desc}</span>
                    </div>
                ))}
            </div>

            
            <section className="dashboard-panel">
                <div className="dashboard-panel__header">
                    <h3>Doanh thu gần đây</h3>
                    <span>Biểu đồ mini</span>
                </div>

                <div className="dashboard-chart-placeholder">
                    Biểu đồ doanh thu sẽ hiển thị ở đây
                </div>
            </section>

            <section>
                <div className="dashboard-panel__header">
                    <h3>Doanh thu gần đây</h3>
                    <span>Theo trạng thái hiện tại</span>
                </div>

                <div className="order-status-grid">
                    {orderStatusCards.map((item) => (
                        <div className="dashboard-card" key={item.title}>
                            <p>{item.title}</p>
                            <h3>{item.value}</h3>
                        </div>
                    ))}
                </div>
            </section>

            <section className="dashboard-panel">
                <div className="dashboard-panel__header">
                    <h3>Ghi chú</h3>
                </div>

                <div className="recent-orders">
                    <p>
                        Dashboard hiện đang hiển thị dữ liệu tổng quan từ hệ thống.
                        Phần thống kê doanh thu chi tiết sẽ nằm ở trang Thống kê riêng
                    </p>
                </div>
            </section>
            
        </div>

    );
}

export default DashboardPage;