import { useEffect, useState } from "react";
import { reviewService } from "../../features/reviews/reviewService";
import "./ReviewReportPage.css";

function ReviewReportPage() {
    const [reports, setReports] = useState([]);
    
    const [keyword, setKeyWord] = useState("");
    const [minAverageRating, setMinAverageRating] = useState("");
    const [sortBy, setSortBy] = useState("averageRating");
    const [sortDir, setSortDir] = useState("desc");
      
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchReport = async (overrideParams = {}) => {
        try {
            setLoading(true);
            setError("");

            const data = await reviewService.getReviewReport({
                keyword: keyword.trim() || undefined,
                minAverageRating: minAverageRating === "" ? undefined : minAverageRating,
                page,
                size,
                sortBy,
                sortDir,
                ...overrideParams
            });

            setReports(data?.content || []);
            setTotalPages(data?.totalPages || 0);
            setTotalElements(data?.totalElements || 0);
        } catch (err) {
            console.error("Fetch review report error:", err);

            setError(
                err?.response?.data?.message || 
                "Không thể tải báo cáo mức độ hài lòng. Vui lòng thử lại sau."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [page, sortBy, sortDir]);

    const handleSearchSubmit = (event) => {
        event.preventDefault();

        const searchParams = {
            keyword: keyword.trim() || undefined,
            minAverageRating: minAverageRating === "" ? undefined : minAverageRating,
            page: 0
        };

        if (page === 0) {
            fetchReport(searchParams);
        } else {
            setPage(0);
        }
    };

    const handleReset = () => {
        setKeyWord("");
        setMinAverageRating("");
        setSortBy("averageRating");
        setSortDir("desc");

        const resetParams = {
            keyword: undefined,
            minAverageRating: undefined,
            page: 0,
            sortBy: "averageRating",
            sortDir: "desc"
        };

        if (page === 0) {
            fetchReport(resetParams);
        } else {
            setPage(0);
        }
    };

    const formatNumber = (value) => {
        if (value === null || value === undefined) {
            return "0";
        }

        return Number(value).toFixed(1);
    };

    return (
        <div className="review-report-page">
            <div className="review-report-page__header">
                <h2>Báo cáo mức độ hài lòng</h2>
            </div>

            <form className="review-report-page__filters" onSubmit={handleSearchSubmit}>
                <div className="review-report-page__filter-group">
                    <label>Tìm kiếm sản phẩm</label>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(event) => setKeyWord(event.target.value)}
                        placeholder="Nhập tên sản phẩm"
                    />
                </div>

                <div className="review-report-page__filter-group">
                    <label>Điểm trung bình tối thiểu</label>
                    <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={minAverageRating}
                        onChange={(event) => setMinAverageRating(event.target.value)}
                        placeholder="VD: 4"
                    />
                </div>

                <div className="review-report-page__filter-group">
                    <label>Sắp xếp theo</label>
                    <select
                        value={sortBy}
                        onChange={(event) => {
                            setSortBy(event.target.value);
                            setPage(0);
                        }}
                    >
                        <option value="averageRating">Điểm trung bình</option>
                        <option value="satisfactionRate">Tỷ lệ hài lòng</option>
                        <option value="totalReviews">Số lượng đánh giá</option>
                        <option value="productName">Tên sản phẩm</option>
                        <option value="productId">Mã sản phẩm</option>
                    </select>
                </div>

                <div className="review-report-page__filter-group">
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

                <div className="review-report-page__filter-actions">
                    <button type="submit">Tìm kiếm</button>
                    <button type="button" onClick={handleReset}>
                        Đặt lại
                    </button>
                </div>
            </form>

            {error && <div className="review-report-page__error">{error}</div>}

            {loading ? (
                <p>Đang tải báo cáo...</p>
            ) : reports.length === 0 ? (
                <div className="review-report-page__empty">
                    <p>Hiện tại chưa có dữ liệu đánh giá phù hợp để lập báo cáo.</p>
                </div>
            ) : (
                <>
                    <div className="review-report-page__summary">
                        Tổng số sản phẩm trong báo cáo: <strong>{totalElements}</strong>
                    </div>

                    <div className="review-report-page__table-wrapper">
                        <table className="review-report-page__table">
                            <thead>
                                <tr>
                                    <th>Mã sản phẩm</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng đánh giá</th>
                                    <th>Điểm trung bình</th>
                                    <th>Tỷ lệ hài lòng</th>
                                </tr>
                            </thead>

                            <tbody>
                                {reports.map((report) => (
                                    <tr key={report.productId}>
                                        <td>#{report.productId}</td>
                                        <td>{report.productName}</td>
                                        <td>{report.totalReviews}</td>
                                        <td>
                                            <strong>{formatNumber(report.averageRating)} / 5</strong>
                                        </td>
                                        <td>
                                            <div className="review-report-page__rate">
                                                <div className="review-report-page__rate-bar">
                                                    <div
                                                        className="review-report-page__rate-fill"
                                                        style={{
                                                            width: `${Math.min(
                                                                Math.max(Number(report.satisfactionRate || 0), 0), 100
                                                            )}%`
                                                        }}
                                                    />
                                                </div>
                                                <span>{formatNumber(report.satisfactionRate)}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="review-report-page__pagination">
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

export default ReviewReportPage;