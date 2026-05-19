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
import { formatCurrency } from "../../utils/formatCurrency";
import Loading from "../../components/common/Loading";
import Button from "../../components/ui/Button";
import "./RevenueStatisticPage.css";

const PAGE_SIZE = 10;

function RevenueStatisticPage() {

    const [type, setType] = useState("DAY");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
   

    useEffect(() => {
        loadRevenueStatistics("DAY", "", "");
        
    }, []);

    /**
     * Tải dữ liệu thống kê doanh thu theo bộ lọc hiện tại.
     *
     * @param {string} filterType DAY | WEEK | MONTH
     * @param {string} filterFromDate Ngày bắt đầu.
     * @param {string} filterToDate Ngày kết thúc.
     */
    const loadRevenueStatistics = async (
        filterType,
        filterFromDate,
        filterToDate
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

    /**
     * Xử lý submit form lọc thống kê doanh thu.
     *
     * Trước khi gọi API, frontend sẽ kiểm tra:
     * - ngày bắt đầu
     * - ngày kết thúc
     * - khoảng thời gian hợp lệ
     *
     * @param {React.FormEvent<HTMLFormElement>} e Sự kiện submit form.
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        if(fromDate && toDate && fromDate > toDate){
            setError("Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.");
            return;
        }

        if(type === "DAY" && fromDate && toDate){
            const diffDdays = getDaysBetween(fromDate, toDate);

            if(diffDdays > 365){
                setError(
                    "Khoảng thời gian quá lớn cho thống kê theo ngày. Vui lòng chọn tối đa 1 năm hoặc chuyển sang thống kê theo tuần/tháng."
                );
                return;
            }
        }

        if(type === "WEEK" && fromDate && toDate){
            const diffDdays = getDaysBetween(fromDate, toDate);

            if(diffDdays > 1095){
                setError(
                    "Khoảng thời gian quá lớn cho thống kê theo tuần. Vui lòng chọn tối đa 3 năm hoặc chuyển sang thống kê theo tháng."
                );
                return;
            }
        }

        if(type === "MONTH" && fromDate && toDate){
            const diffDdays = getDaysBetween(fromDate, toDate);

            if(diffDdays > 1825){
                setError(
                    "Khoảng thời gian quá lớn cho thống kê theo tháng. Vui lòng chọn tối đa 5 năm."
                );
                return;
            }
        }

        // Đưa page về 1 khi lọc hoặc reset
        setCurrentPage(1);
        loadRevenueStatistics(type, fromDate, toDate);
    };

    /**
     * Đặt lại bộ lọc thống kê về mặc định.
     */
    const handleReset = () => {
        setType("DAY");
        setFromDate("");
        setToDate("");
        setError("");
        setCurrentPage(1);

        loadRevenueStatistics("DAY", "", "");
    };

    const chartData = statistics?.chartData || [];

    const totalPages = Math.ceil(chartData.length / PAGE_SIZE);

    const paginatedChartData = chartData.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const getDaysBetween = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        return (end - start) / (1000 * 60 * 60 * 24);
    };

    const formatDateDisplay = (date) => {
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
        });
    };

    const getWeekDateRange = (label) => {
        if (!label || !label.includes("-W")){
            return null;
        }

        const [yearText, weekText] = label.split("-W");
        const year = Number(yearText);
        const week = Number(weekText);

        if(!year || !week){
            return null;
        }

        const firstDayOfYear = new Date(year, 0, 1);
        const weekStart = new Date(firstDayOfYear);

        weekStart.setDate(firstDayOfYear.getDate() + (week - 1) * 7);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        return {
            start: formatDateDisplay(weekStart),
            end: formatDateDisplay(weekEnd)
        };
    };

    const formatChartLabel = (label) => {
        if(type !== "WEEK"){
            return label;
        }

        if(!label || !label.includes("-W")){
            return label;
        }

        const [, weekText] = label.split("-W");
        return `Tuần ${Number(weekText)}`
    };

    const formatTablePeriod = (label) => {
        if(type !== "WEEK"){
            return label;
        }

        const range = getWeekDateRange(label);

        return (
            <div className="week-period">
                <strong>{formatChartLabel(label)}</strong>
                {range && (
                    <span>
                        {range.start} - {range.end}
                    </span>
                )}
            </div>
        );
    };

    const getEmptyChartMessage = () => {
        if (type === "DAY"){
            return "Không có dữ liệu doanh thu theo ngày trong khoảng thời gian này."
        }

        if (type === "WEEK"){
            return "Không có dữ liệu doanh thu theo tuần trong khoảng thời gian này."
        }

        return "Không có dữ liệu doanh thu theo tháng trong khoảng thời gian này.";
    };

    {loading && <Loading/>}

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
                        setCurrentPage(1);

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
                        onChange={(e) => {
                            setError("");
                            setFromDate(e.target.value);
                        }}
                    />
                </div>

                <div className="filter-group">
                    <label>Đến ngày</label>
                    <input  
                        type="date"
                        value={toDate}
                        onChange={(e) => {
                            setError("");
                            setToDate(e.target.value);
                        }}
                    />
                </div>

                <div className="filter-action">
                    <Button type="submit" disabled={loading}>Lọc dữ liệu</Button>

                    <Button
                        type="button"
                        variant="secondary"
                        disabled={loading}
                        onClick={handleReset}>
                            Đặt lại
                    </Button>
                </div>
            </form>

            <div className="revenue-summary">
                <div className="revenue-card">
                    <p>Tổng doanh thu trong kỳ</p>
                    <h3>{formatCurrency(statistics?.totalRevenue)}</h3>
                    <span>
                        {statistics?.fromDate || "-"} đến{" "} 
                        {statistics?.toDate || "-"}
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
                        {getEmptyChartMessage()}
                    </div>
                ) : (
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart 
                                data={chartData}
                                margin={{ top: 10, right: 24, left: 16, bottom: 16 }}
                            >
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis 
                                    dataKey="label"
                                    tick={{fontSize: 12}}
                                    tickFormatter={formatChartLabel}
                                />
                                <YAxis
                                    width={100}
                                    tick={{ fontSize: 14 }}
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
                                paginatedChartData.map((item) => (
                                    <tr key={item.label}>
                                        <td>{formatTablePeriod(item.label)}</td>
                                        <td>{formatCurrency(item.revenue)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {chartData.length > PAGE_SIZE && (
                        <div className="revenue-pagination">
                            <Button 
                                type="button"
                                variant="secondary"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Trước
                            </Button>

                            <span>
                                Trang {currentPage} / {totalPages}
                            </span>

                            <Button
                                type="button"
                                variant="secondary"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Sau
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default RevenueStatisticPage;