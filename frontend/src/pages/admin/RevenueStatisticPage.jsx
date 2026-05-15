import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    
} from "recharts";
import { fetchRevenueStatistics } from "../../features/statistics/statisticService";
import Loading from "../../components/common/Loading";
import Button from "../../components/ui/Button";
import "./RevenueStatisticPage.css";


function RevenueStatisticPage() {

    const [type, setType] = useState("DAY");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadRevenueStatistics("DAY", "", "");
    }, []);

    const formatCurrency = (value) => {
        return Number(value || 0).toLocaleString("vi-VN") + "đ";
    };

    const loadRevenueStatistics = async (
        filterType,
        filterFromDate,
        filterToDate,
    ) => {
        try {
            setLoading(true);
            setError("");

            const params = {
                type: filterType,
            };

            if (filterFromDate){
                params.fromDate = filterFromDate;
            }

            if (filterToDate){
                params.toDate = filterToDate;
            }

            const data = await fetchRevenueStatistics(params);
            setStatistics(data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Không thể tải dữ liệu thống kê doanh thu."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(fromDate && toDate && fromDate > toDate){
            setError("Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.");
            return;
        }

        loadRevenueStatistics(type, fromDate, toDate);
    };

    const chartData = statistics?.chartData || [];

    if (loading) {
        return <Loading/>;
    }

    return (
        <div className="revenue-stat-page">
            <div className="revenue-stat-header">
                <div>
                    <h2>Thống kê doanh thu</h2>
                    <p>Theo dõi doanh thu theo ngày, tuần hoặc tháng</p>
                </div>
            </div>

            {error && <p className="revenue-stat-error">{error}</p>}

            <form className="revenue-filter" onSubmit={handleSubmit}>
                <div className="filter-group">
                    <label>Loại thống kê</label>
                    <select value={type} onChange={(e) =>{ 
                        setError(""); 
                        setType(e.target.value);

                    }}>
                        <option value="DAY">Theo ngày</option>
                        <option value="WEEK">Theo tuần</option>
                        <option value="MONTH">Theo tháng</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Từ ngày</label>
                    <input  
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label>Đến ngày</label>
                    <input  
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>

                <div className="filter-action">
                    <Button type="submit">Lọc dữ liệu</Button>
                </div>
            </form>

            <div className="revenue-summary">
                <div className="revenue-card">
                    <p>Tổng doanh thu trong kỳ</p>
                    <h3>{formatCurrency(statistics?.totalRevenue)}</h3>
                    <span>
                        {statistics?.fromDate || "-"} đến {statistics?.toDate || "-"}
                    </span>
                </div>

                <div className="revenue-card">
                    <p>Số đơn hoàn thành</p>
                    <h3>{statistics?.completedOrders || 0}</h3>
                    <span>Chỉ tính đơn đã hoàn thành</span>
                </div>

                <div className="revenue-card">
                    <p>Kiểu thống kê</p>
                    <h3>{statistics?.type || type}</h3>
                    <span>DAY / WEEK / MONTH</span>
                </div>
            </div>

            <section className="revenue-panel">
                <div className="revenue-panel-header">
                    <h3>Biểu đồ doanh thu</h3>
                    <span>{chartData.length} mốc dữ liệu</span>
                </div>

                {chartData.length === 0 ? (
                    <div className="empty-chart">
                        Không có dữ liệu doanh thu trong khoảng thời gian này.
                    </div>
                ) : (
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="label"/>
                                <YAxis
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
                                    dot={{ r: 4}}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </section>

            <section className="revenue-panel">
                <div className="revenue-panel-header">
                    <h3>Bảng chi tiết</h3>
                    <span>Theo từng mốc thời gian</span>
                </div>

                <div className="revenue-table-wrapper">
                    <table className="revenue-table">
                        <thead>
                            <tr>
                                <th>Mốc thời gian</th>
                                <th>Doanh thu</th>
                            </tr>
                        </thead>

                        <tbody>
                            {chartData.length === 0 ? (
                                <tr>
                                    <td colSpan="2" className="empty-row">
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            ) : (
                                chartData.map((item) => (
                                    <tr key={item.label}>
                                        <td>{item.label}</td>
                                        <td>{formatCurrency(item.revenue)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default RevenueStatisticPage;