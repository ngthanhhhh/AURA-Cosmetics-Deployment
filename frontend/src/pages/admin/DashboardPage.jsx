import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { fetchDashboardStatistics, fetchRevenueStatistics } from "../../features/statistics/statisticService";
import Loading from "../../components/common/Loading";
import Button from "../../components/ui/Button";
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
    const [revenueData, setRevenueData] = useState(null);
    const [revenueRange, setRevenueRange] = useState(7);
    const [loading, setLoading] = useState(false);
    const [chartLoading, setChartLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboardData();
    }, []);

    useEffect(() => {
        loadMiniRevenueChart(revenueRange);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [revenueRange]);

    const formatDateParam = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const getDateRange = (days) => {
        const toDate = new Date();
        const fromDate = new Date();

        fromDate.setDate(toDate.getDate() - (days - 1));

        return {
            fromDate: formatDateParam(fromDate),
            toDate: formatDateParam(toDate),
        };
    };

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
    };

    const loadMiniRevenueChart = async (days) => {
        try {
            setChartLoading(true);

            const { fromDate, toDate } = getDateRange(days);

            const data = await fetchRevenueStatistics({
                type: "DAY",
                fromDate,
                toDate,
            });

            setRevenueData(data);
        } catch {
            setError("Không thể tải biểu đồ doanh thu.");
        } finally {
            setChartLoading(false);
        }
    };

    

    const summaryCards = [
        {
            title: "Tổng doanh thu",
            value: formatCurrency(dashboardData?.totalRevenue || 0),
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
            title: "Đã giao",
            value: dashboardData?.deliveredOrders || 0,
        },
        {
            title: "Đã hủy",
            value: dashboardData?.cancelledOrders || 0,
        },
    ];

    const chartData = revenueData?.chartData || [];

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
                    <div>
                        <h3>Doanh thu gần đây</h3>
                        <span>
                            {revenueData?.fromDate || "-"} đến {revenueData?.toDate || "-"}
                        </span>
                    </div>

                    <div className="dashboard-chart-filter">
                        <Button
                            type="button"
                            variant={revenueRange === 7 ? "primary" : "secondary"}
                            onClick={() => setRevenueRange(7)}
                        >
                            7 ngày
                        </Button>

                        <Button
                            type="button"
                            variant={revenueRange === 30 ? "primary" : "secondary"}
                            onClick={() => setRevenueRange(30)}
                        >
                            30 ngày
                        </Button>
                    </div>
                </div>

                <div className="dashboard-chart-summary">
                    <p>Tổng doanh thu kỳ này</p>
                    <h3>{formatCurrency(revenueData?.totalRevenue || 0)}</h3>
                </div>

                {chartLoading ? (
                    <div className="dashboard-chart-loading">
                        <Loading/>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="dashboard-chart-placeholder">
                        Không có dữ liệu doanh thu trong khoảng thời gian này.
                    </div>
                ) : (
                    <div className="dashboard-chart-wrapper">
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart 
                                data={chartData}
                                margin={{ top: 10, right: 24, left: 16, bottom: 16 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label"/>
                                <YAxis
                                    width={100}
                                    tickFormatter={(value) => 
                                        Number(value).toLocaleString("vi-VN")
                                    }
                                />
                                <Tooltip
                                    formatter={(value) => [
                                        formatCurrency(value),
                                        "Doanh thu",
                                    ]}
                                />
                                <Line 
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#e26d4f"
                                    strokeWidth={3}
                                    dot={{ r: 3 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </section>

            <section className="dashboard-panel">
                <div className="dashboard-panel__header">
                    <h3>Trạng thái đơn hàng</h3>
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
                        Dashboard hiển thị dữ liệu tổng quan và biểu đồ doanh thu ngắn hạn.
                        Để xem phân tích chi tiết, truy cập{" "}
                        <Link to="/admin/revenue" className="dashboard-note-link">
                            Thống kê doanh thu
                        </Link>
                    </p>
                </div>
            </section>
            
        </div>

    );
}

export default DashboardPage;