import { useEffect, useState } from "react";
import { reviewService } from "../../features/reviews/reviewService";
import "./ReviewReportPage.css";

/**
 * Trang Admin xem báo cáo mức độ hài lòng theo sản phẩm.
 *
 * Component này hỗ trợ:
 * - Lấy báo cáo đánh giá từ backend
 * - Tìm kiếm theo từ khóa
 * - Lọc theo điểm đánh giá trung bình tối thiểu
 * - Sắp xếp theo điểm trung bình, số lượng đánh giá...
 * - Phân trang danh sách báo cáo
 */
function ReviewReportPage() {
    // State lưu danh sách báo cáo đánh giá.
    const [reports, setReports] = useState([]);
    
    const [keyword, setKeyWord] = useState("");// State lưu từ khóa tìm kiếm.

    // State lọc theo điểm đánh giá trung bình tối thiểu.
    const [minAverageRating, setMinAverageRating] = useState("");
    const [sortBy, setSortBy] = useState("averageRating");
    const [sortDir, setSortDir] = useState("desc");
      
    const [page, setPage] = useState(0);

    // State lưu số lượng báo cáo trên mỗi trang.
    // Ở đây cố định là 10 nên không cần setter.
    const [size] = useState(10);

    // State lưu tổng số trang backend trả về.
    const [totalPages, setTotalPages] = useState(0);
    // State lưu tổng số sản phẩm/báo cáo phù hợp với điều kiện lọc.
    const [totalElements, setTotalElements] = useState(0);

    // State kiểm tra trang có đang tải dữ liệu hay không.
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // State lưu thông báo lỗi khi gọi API thất bại.

    /**
     * Gọi API lấy báo cáo mức độ hài lòng.
     *
     * overrideParams dùng để ghi đè tham số hiện tại trong một số trường hợp,
     * ví dụ khi submit tìm kiếm hoặc reset bộ lọc.
     *
     * Request gửi lên backend gồm:
     * - keyword: tìm kiếm theo tên sản phẩm hoặc nội dung liên quan
     * - minAverageRating: lọc sản phẩm có điểm trung bình từ mức này trở lên
     * - page, size: phân trang
     * - sortBy, sortDir: sắp xếp
     */
    const fetchReport = async (overrideParams = {}) => {
        try {
            // Bật loading và xóa lỗi cũ.
            setLoading(true);
            setError("");

            // Gọi service lấy dữ liệu báo cáo đánh giá.
            const data = await reviewService.getReviewReport({
                keyword: keyword.trim() || undefined, // Nếu keyword sau khi trim là rỗng thì gửi undefined để không tìm kiếm.
                minAverageRating: minAverageRating === "" ? undefined : minAverageRating, // Nếu minAverageRating rỗng thì không lọc theo điểm trung bình.
                page,
                size,
                sortBy,
                sortDir,
                ...overrideParams // Các tham số truyền vào sau sẽ ghi đè các giá trị phía trên nếu trùng key.
            });

            setReports(data?.content || []); // Lưu danh sách báo cáo của trang hiện tại.
            setTotalPages(data?.totalPages || 0); // Lưu tổng số trang.
            setTotalElements(data?.totalElements || 0); // Lưu tổng số bản ghi/sản phẩm.
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

    /**
     * Tự động tải lại báo cáo khi:
     * - page thay đổi
     * - sortBy thay đổi
     * - sortDir thay đổi
     *
     * keyword và minAverageRating không nằm trong dependency
     * để tránh gọi API liên tục khi Admin đang nhập.
     */
    useEffect(() => {
        fetchReport();
    }, [page, sortBy, sortDir]);

    /**
     * Xử lý khi Admin submit form tìm kiếm/lọc báo cáo.
     *
     * @param event Sự kiện submit form
     */
    const handleSearchSubmit = (event) => {
        event.preventDefault(); // Ngăn form reload lại trang.

        // Tạo bộ tham số tìm kiếm mới.
        const searchParams = {
            keyword: keyword.trim() || undefined,
            minAverageRating: minAverageRating === "" ? undefined : minAverageRating,
            page: 0 // Khi tìm kiếm mới thì quay về trang đầu tiên.
        };

        if (page === 0) { // Nếu đang ở trang đầu thì gọi API ngay.
            fetchReport(searchParams);
        } else {
            // Nếu không ở trang đầu thì setPage(0).
            // useEffect sẽ tự gọi lại API sau khi page đổi.
            setPage(0);
        }
    };

    /**
     * Đặt lại toàn bộ bộ lọc và sắp xếp về mặc định.
     */
    const handleReset = () => {
        // Reset state filter.
        setKeyWord("");
        setMinAverageRating("");

        // Reset state sort về mặc định.
        setSortBy("averageRating");
        setSortDir("desc");

        // Tạo bộ tham số reset để gọi API với dữ liệu sạch.
        const resetParams = {
            keyword: undefined,
            minAverageRating: undefined,
            page: 0,
            sortBy: "averageRating",
            sortDir: "desc"
        };

        // Nếu đang ở trang đầu thì gọi API ngay.
        if (page === 0) {
            fetchReport(resetParams);
        } else {
            // Nếu không ở trang đầu thì quay về trang đầu.
            // useEffect sẽ tự gọi lại API.
            setPage(0);
        }
    };

    /**
     * Format số để hiển thị điểm trung bình.
     *
     * Ví dụ:
     * - 4 => 4.0
     * - 4.256 => 4.3
     * - null/undefined => 0
     *
     * @param value Giá trị số cần format
     * @returns Chuỗi số đã format 1 chữ số thập phân
     */
    const formatNumber = (value) => {
        // Nếu không có dữ liệu thì hiển thị 0.
        if (value === null || value === undefined) {
            return "0";
        }

        // Chuyển value về number và lấy 1 chữ số thập phân.
        return Number(value).toFixed(1);
    };

    return (
        <div className="review-report-page">
            <div className="review-report-page__header">
                <h2>Báo cáo mức độ hài lòng</h2>
            </div>

            {/* Form tìm kiếm, lọc và sắp xếp báo cáo */}
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

                {/* Chọn chiều sắp xếp */}
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

            {/* Hiển thị thông báo lỗi nếu có */}
            {error && <div className="review-report-page__error">{error}</div>}

            {/* Nếu đang tải dữ liệu thì hiển thị loading */}
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
                                {/* Render từng dòng báo cáo theo từng sản phẩm */}
                                {reports.map((report) => (
                                    <tr key={report.productId}>
                                        <td>#{report.productId}</td>
                                        <td>{report.productName}</td>
                                        <td>{report.totalReviews}</td>
                                        <td>
                                            <strong>{formatNumber(report.averageRating)} / 5</strong>
                                        </td>

                                        {/* Tỷ lệ hài lòng hiển thị bằng thanh progress và phần trăm */}
                                        <td>
                                            <div className="review-report-page__rate">
                                                {/* Thanh nền của tỷ lệ hài lòng */}
                                                <div className="review-report-page__rate-bar">
                                                    {/* 
                                                        Thanh fill bên trong.
                                                        width được tính theo satisfactionRate.
                                                        Math.max(..., 0) để không nhỏ hơn 0%.
                                                        Math.min(..., 100) để không vượt quá 100%.
                                                    */}
                                                    <div
                                                        className="review-report-page__rate-fill"
                                                        style={{
                                                            width: `${Math.min(
                                                                Math.max(Number(report.satisfactionRate || 0), 0), 100
                                                            )}%`
                                                        }}
                                                    />
                                                </div>
                                                {/* Hiển thị tỷ lệ hài lòng dạng phần trăm */}
                                                <span>{formatNumber(report.satisfactionRate)}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Phân trang danh sách báo cáo */}
                    <div className="review-report-page__pagination">
                        <button
                            type="button"
                            disabled={page <= 0}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            Trang trước
                        </button>

                        {/* Hiển thị trang hiện tại / tổng số trang */}
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