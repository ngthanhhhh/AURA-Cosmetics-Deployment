import { useEffect, useState } from "react";
import { reviewService } from "../../features/reviews/reviewService";
import { formatDate } from "../../utils/formatDate";
import "./ReviewManagementPage.css";

/**
 * Trang Admin quản lý danh sách đánh giá sản phẩm.
 *
 * Component này hỗ trợ:
 * - Lấy danh sách đánh giá từ backend
 * - Lọc theo số sao, trạng thái đánh giá, xác nhận mua hàng, productId
 * - Tìm kiếm theo từ khóa
 * - Sắp xếp và phân trang danh sách đánh giá
 * - Cập nhật trạng thái phân loại/flag của đánh giá
 */
function ReviewManagementPage() {
    const [reviews, setReviews] = useState([]); // State lưu danh sách đánh giá hiện tại.

    const [rating, setRating] = useState(""); // State lọc theo số sao.
    const [flag, setFlag] = useState(""); // State lọc theo trạng thái/flag của đánh giá.
    const [verified, setVerified] = useState(""); // State lọc theo đánh giá đã xác nhận mua hàng hay chưa.
    const [productId, setProductId] = useState(""); // State lọc theo ID sản phẩm.
    const [keyword, setKeyWord] = useState(""); // State lưu từ khóa tìm kiếm.
    const [sortBy, setSortBy] = useState("createdAt"); // State lưu trường dùng để sắp xếp.
    const [sortDir, setSortDir] = useState("desc"); // State lưu chiều sắp xếp, mặc định là giảm dần.

    const [page, setPage] = useState(0); // State lưu trang hiện tại, bắt đầu từ 0.

    // State lưu số lượng đánh giá trên mỗi trang.
    // Ở đây cố định là 10 nên không cần setter.
    const [size] = useState(10);

    // State lưu tổng số trang backend trả về.
    const [totalPages, setTotalPages] = useState(0);

    // State lưu tổng số đánh giá phù hợp với bộ lọc.
    const [totalElements, setTotalElements] = useState(0);

    const [loading, setLoading] = useState(false); // State kiểm tra trang có đang tải danh sách đánh giá hay không.

    // State lưu reviewId đang được cập nhật flag.
    // Dùng để disable riêng dòng đang update.
    const [updatingReviewId, setUpdatingReviewId] = useState(null);

    const [error, setError] = useState(""); // State lưu thông báo lỗi.
    const [successMessage, setSuccessMessage] = useState(""); // State lưu thông báo thành công.

    /**
     * Gọi API lấy danh sách đánh giá phía Admin.
     *
     * Request gửi lên backend gồm:
     * - rating: lọc theo số sao
     * - flag: lọc theo trạng thái đánh giá
     * - verified: lọc theo xác nhận mua hàng
     * - productId: lọc theo sản phẩm
     * - keyword: tìm kiếm theo từ khóa
     * - page, size: phân trang
     * - sortBy, sortDir: sắp xếp
     */
    const fetchReviews = async () => {
        try {
            // Bật loading và xóa lỗi cũ.
            setLoading(true);
            setError("");

            // Gọi service lấy danh sách đánh giá cho Admin.
            const data = await reviewService.getAdminReviews({
                rating: rating || undefined, // Nếu rating rỗng thì gửi undefined để không lọc theo sao.
                flag: flag || undefined, // Nếu flag rỗng thì gửi undefined để lấy tất cả trạng thái.

                // Nếu verified rỗng thì không lọc.
                // Nếu verified = "true" thì gửi true, ngược lại gửi false.
                verified: verified === "" ? undefined : verified === "true",

                // Nếu productId sau khi trim là rỗng thì không lọc theo sản phẩm.
                productId: productId.trim() || undefined,
                keyword: keyword.trim() || undefined, // Nếu keyword sau khi trim là rỗng thì không tìm kiếm.
                page,
                size, 
                sortBy,
                sortDir
            });

            setReviews(data?.content || []); // Lưu danh sách đánh giá của trang hiện tại.
            setTotalPages(data?.totalPages || 0); // Lưu tổng số trang.
            setTotalElements(data?.totalElements || 0); // Lưu tổng số đánh giá.
        } catch (err) {
            console.error("Fetch admin reviews error: ", err); // In lỗi ra console để debug.

            setError(
                err?.response?.data?.message ||
                "Không thể tải danh sách đánh giá. Vui lòng thử lại sau."
            );
        } finally {
            setLoading(false);
        }
    };

    /**
     * Tự động tải lại danh sách đánh giá khi:
     * - page thay đổi
     * - rating thay đổi
     * - flag thay đổi
     * - verified thay đổi
     * - sortBy hoặc sortDir thay đổi
     *
     * productId và keyword không nằm trong dependency để tránh gọi API liên tục khi đang gõ.
     * Hai trường này chỉ tìm khi submit form.
     */
    useEffect(() => {
        fetchReviews();
    }, [page, rating, flag, verified, sortBy, sortDir]);

    /**
     * Xử lý khi submit form tìm kiếm/lọc đánh giá.
     *
     * @param event Sự kiện submit form
     */
    const handleSearchSubmit = (event) => {
        event.preventDefault(); // Ngăn form reload lại trang.
        setPage(0); // Khi tìm kiếm mới thì quay về trang đầu tiên.
        fetchReviews(); // Gọi lại API với keyword/productId hiện tại.
    };

    /**
     * Đặt lại toàn bộ bộ lọc và sắp xếp về mặc định.
     */
    const handleReset = () => {
        setRating("");
        setFlag("");
        setVerified("");
        setProductId("");
        setKeyWord("");
        setSortBy("createdAt");
        setSortDir("desc");
        setPage(0);
    };

    /**
     * Cập nhật trạng thái/flag của một đánh giá.
     *
     * @param reviewId ID của đánh giá cần cập nhật
     * @param newFlag  Trạng thái flag mới
     */
    const handleUpdateFlag = async (reviewId, newFlag) => {
        if (!newFlag) return; // Nếu chưa chọn flag mới thì không làm gì.

        try {
            setUpdatingReviewId(reviewId); // Lưu reviewId đang được cập nhật để khóa thao tác ở dòng đó.
            
             // Xóa thông báo cũ.
            setError("");
            setSuccessMessage("");

            await reviewService.updateReviewFlag(reviewId, newFlag); // Gọi API cập nhật flag đánh giá.

            setSuccessMessage("Cập nhật trạng thái đánh giá thành công.");
            await fetchReviews(); // Tải lại danh sách đánh giá sau khi cập nhật.
        } catch (err) {
            console.error("Update review flag error: ", err);

            setError(
                err?.response?.data?.message || "Không thể cập nhật trạng thái đánh giá. Vui lòng thử lại sau!"
            );
        } finally {
            setUpdatingReviewId(null); // Reset reviewId đang cập nhật.
        }
    };

    /**
     * Chuyển mã flag của đánh giá sang nhãn tiếng Việt.
     *
     * @param value Mã flag từ backend
     * @returns Nhãn flag tiếng Việt
     */
    const getFlagLabel = (value) => {
        const labels = {
            NORMAL: "Bình thường",
            NEGATIVE_FEEDBACK: "Phản hồi tiêu cực",
            ATTENTION_NEEDED: "Cần chú ý"
        };

        // Nếu flag không nằm trong labels thì hiển thị lại giá trị gốc.
        return labels[value] || value;
    };

    /**
     * Render số sao dưới dạng ký tự.
     *
     * Ví dụ:
     * - value = 5 => ★★★★★
     * - value = 3 => ★★★☆☆
     *
     * @param value Số sao cần hiển thị
     * @returns Chuỗi sao tương ứng
     */
    const renderStars = (value) => {
        const ratingValue = Number(value || 0);  // Chuyển rating về number, nếu không có thì mặc định là 0.
        return "★".repeat(ratingValue) + "☆".repeat(5 - ratingValue); // Tạo số sao đặc tương ứng ratingValue và sao rỗng cho phần còn lại.
    };

    return (
        <div className="admin-reviews-page">
            <div className="admin-reviews-page__header">
                <h2>Quản lý đánh giá</h2>
            </div>

            {/* Form tìm kiếm, lọc và sắp xếp danh sách đánh giá */}
            <form className="admin-reviews-page__filters" onSubmit={handleSearchSubmit}>
                {/* Ô tìm kiếm theo bình luận, tên sản phẩm hoặc người đánh giá */}
                <div className="admin-reviews-page__filter-group">
                    <label>Tìm kiếm</label>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(event) => setKeyWord(event.target.value)}
                        placeholder="Bình luận, tên sản phẩm, người đánh giá"
                    />
                </div>

                <div className="admin-reviews-page__filter-group">
                    <label>Mã sản phẩm</label>
                    <input
                        type="number"
                        min="1"
                        value={productId}
                        onChange={(event) => setProductId(event.target.value)}
                        placeholder="VD: 1"
                    />
                </div>

                <div className="admin-reviews-page__filter-group">
                    <label>Số sao</label>
                    <select
                        value={rating}
                        onChange={(event) => {
                            setRating(event.target.value); // Cập nhật số sao cần lọc.
                            setPage(0); // Khi đổi bộ lọc thì quay về trang đầu tiên.
                        }}
                    >
                        <option value="">Tất cả</option>
                        <option value="5">5 sao</option>
                        <option value="4">4 sao</option>
                        <option value="3">3 sao</option>
                        <option value="2">2 sao</option>
                        <option value="1">1 sao</option>
                    </select>
                </div>

                {/* Bộ lọc theo trạng thái đánh dấu của Admin */}
                <div className="admin-reviews-page__filter-group">
                    <label>Trạng thái đánh dấu</label>
                    <select
                        value={flag}
                        onChange={(event) => {
                            setFlag(event.target.value); // Cập nhật trạng thái flag cần lọc.
                            setPage(0); // Khi đổi bộ lọc thì quay về trang đầu tiên.
                        }}
                    >
                        <option value="">Tất cả</option>
                        <option value="NORMAL">Bình thường</option>
                        <option value="NEGATIVE_FEEDBACK">Phản hồi tiêu cực</option>
                        <option value="ATTENTION_NEEDED">Cần chú ý</option>
                    </select>
                </div>

                {/* Bộ lọc theo trạng thái xác nhận mua hàng */}
                <div className="admin-reviews-page__filter-group">
                    <label>xác nhận mua hàng</label>
                    <select
                        value={verified}
                        onChange={(event) => {
                            setVerified(event.target.value); // Cập nhật điều kiện lọc đã mua/chưa xác nhận.
                            setPage(0); // Khi đổi bộ lọc thì quay về trang đầu tiên.
                        }}
                    >
                        <option value="">Tất cả</option>
                        <option value="true">Đã mua hàng</option>
                        <option value="false">Chưa xác nhận</option>
                    </select>
                </div>

                <div className="admin-reviews-page__filter-group">
                    <label>Sắp xếp theo</label>
                    <select
                        value={sortBy}
                        onChange={(event) => {
                            setSortBy(event.target.value); // Cập nhật trường sắp xếp.
                            setPage(0); // Khi đổi sắp xếp thì quay về trang đầu tiên.
                        }}
                    >
                        <option value="createdAt">Thời gian tạo</option>
                        <option value="updatedAt">Thời gian cập nhật</option>
                        <option value="rating">Số sao</option>
                        <option value="adminFlag">Trạng thái đánh dấu</option>
                        <option value="isVerifiedPurchase">Xác nhận mua hàng</option>
                        <option value="reviewId">Mã đánh giá</option>
                    </select>
                </div>

                <div className="admin-reviews-page__filter-group"> {/* Chọn chiều sắp xếp */}
                    <label>Thứ tự</label>
                    <select
                        value={sortDir}
                        onChange={(event) => {
                            setSortDir(event.target.value); // Cập nhật chiều sắp xếp asc/desc.
                            setPage(0); // Khi đổi chiều sắp xếp thì quay về trang đầu tiên.
                        }}
                    >
                        <option value="desc">Giảm dần</option>
                        <option value="asc">Tăng dần</option>
                    </select>
                </div>

                {/* Nhóm nút tìm kiếm và đặt lại bộ lọc */}
                <div className="admin-reviews-page__filter-actions">
                    <button type="submit">Tìm kiếm</button>
                    <button type="button" onClick={handleReset}>
                        Đặt lại
                    </button>
                </div>
            </form>

            {/* Hiển thị thông báo lỗi nếu có */}
            {error && <div className="admin-reviews-page__error">{error}</div>}

            {/* Hiển thị thông báo thành công nếu cập nhật flag thành công */}
            {successMessage && (
                <div className="admin-reviews-page__success">{successMessage}</div>
            )}

            {/*Nếu không có đánh giá phù hợp thì hiển thị trạng thái rỗng.*/}
            {loading ? (
                <p>Đang tải danh sách đánh giá...</p>
            ) : reviews.length === 0 ? (
                <div className="admin-reviews-page__empty">
                    <p>Không có đánh giá phù hợp.</p>
                </div>
            ) : (
                <>
                    {/* Hiển thị tổng số đánh giá phù hợp với bộ lọc */}
                    <div className="admin-reviews-page__summary">
                        Tổng số đánh giá: <strong>{totalElements}</strong>
                    </div>

                    {/* Bảng danh sách đánh giá */}
                    <div className="admin-reviews-page__table-wrapper">
                        <table className="admin-reviews-page__table">
                            <thead>
                                <tr>
                                    <th>Mã</th>
                                    <th>Sản phẩm</th>
                                    <th>Người đánh giá</th>
                                    <th>Số sao</th>
                                    <th>Bình luận</th>
                                    <th>Xác nhận mua</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày tạo</th>
                                    <th>Cập nhật trạng thái</th>
                                </tr>
                            </thead>

                            <tbody>
                                {/* Render từng đánh giá thành một dòng trong bảng */}
                                {reviews.map((review) => {
                                    // Kiểm tra dòng review hiện tại có đang cập nhật flag hay không.
                                    const isUpdating = updatingReviewId === review.reviewId;

                                    return (
                                        <tr key={review.reviewId}>
                                            <td>#{review.reviewId}</td> {/* Mã đánh giá */}
                                            <td>
                                                <div className="admin-reviews-page__product">
                                                    {review.productName}
                                                </div>
                                                <span>SP #{review.productId}</span>
                                            </td>

                                            <td>{review.userName}</td>

                                            <td>
                                                <span className="admin-reviews-page__stars">
                                                    {renderStars(review.rating)}
                                                </span>
                                            </td>

                                            <td className="admin-reviews-page__comment">
                                                {review.comment || "Không có bình luận"}
                                            </td>

                                            <td>
                                                {review.isVerifiedPurchase ? (
                                                    <span className="admin-reviews-page__verified">
                                                        Đã mua
                                                    </span>
                                                ) : (
                                                    <span className="admin-reviews-page__not-verified">
                                                        Chưa xác nhận
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                <span className={`admin-reviews-page__flag flag-${review.adminFlag}`}>
                                                    {getFlagLabel(review.adminFlag)}
                                                </span>
                                            </td>
                                            <td>{formatDate(review.createdAt)}</td>

                                            {/* Select cập nhật trạng thái flag cho đánh giá */}
                                            <td>
                                                <select
                                                    value={review.adminFlag || "NORMAL"}
                                                    disabled={isUpdating}
                                                    onChange={(event) =>
                                                        handleUpdateFlag(review.reviewId, event.target.value)
                                                    }
                                                >
                                                    <option value="NORMAL">Bình thường</option>
                                                    <option value="NEGATIVE_FEEDBACK">Phản hồi tiêu cực</option>
                                                    <option value="ATTENTION_NEEDED">Cần chú ý</option>
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="admin-reviews-page__pagination">
                        <button
                            type="button"
                            disabled={page <= 0} // Không cho bấm nếu đang ở trang đầu tiên.
                            onClick={() => setPage((prev) => prev - 1)} // Chuyển về trang trước.
                        >
                            Trang trước
                        </button>

                        <span>
                            Trang {page + 1} / {totalPages || 1} {/* Hiển thị trang hiện tại / tổng số trang */}
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

export default ReviewManagementPage;