import { useEffect, useState } from "react";
import { reviewService } from "../../features/reviews/reviewService";
import { formatDate } from "../../utils/formatDate";
import "./ReviewManagementPage.css";

function ReviewManagementPage() {
    const [reviews, setReviews] = useState([]);

    const [rating, setRating] = useState("");
    const [flag, setFlag] = useState("");
    const [verified, setVerified] = useState("");
    const [productId, setProductId] = useState("");
    const [keyword, setKeyWord] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortDir, setSortDir] = useState("desc");

    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [loading, setLoading] = useState(false);
    const [updatingReviewId, setUpdatingReviewId] = useState(null);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await reviewService.getAdminReviews({
                rating: rating || undefined,
                flag: flag || undefined,
                verified: verified === "" ? undefined : verified === "true",
                productId: productId.trim() || undefined,
                keyword: keyword.trim() || undefined,
                page,
                size, 
                sortBy,
                sortDir
            });

            setReviews(data?.content || []);
            setTotalPages(data?.totalPages || 0);
            setTotalElements(data?.totalElements || 0);
        } catch (err) {
            console.error("Fetch admin reviews error: ", err);

            setError(
                err?.response?.data?.message ||
                "Không thể tải danh sách đánh giá. Vui lòng thử lại sau."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [page, rating, flag, verified, sortBy, sortDir]);

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setPage(0);
        fetchReviews();
    };

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

    const handleUpdateFlag = async (reviewId, newFlag) => {
        if (!newFlag) return;

        try {
            setUpdatingReviewId(reviewId);
            setError("");
            setSuccessMessage("");

            await reviewService.updateReviewFlag(reviewId, newFlag);

            setSuccessMessage("Cập nhật trạng thái đánh giá thành công.");
            await fetchReviews();
        } catch (err) {
            console.error("Update review flag error: ", err);

            setError(
                err?.response?.data?.message || "Không thể cập nhật trạng thái đánh giá. Vui lòng thử lại sau!"
            );
        } finally {
            setUpdatingReviewId(null);
        }
    };

    const getFlagLabel = (value) => {
        const labels = {
            NORMAL: "Bình thường",
            NEGATIVE_FEEDBACK: "Phản hồi tiêu cực",
            ATTENTION_NEEDED: "Cần chú ý"
        };

        return labels[value] || value;
    };

    const renderStars = (value) => {
        const ratingValue = Number(value || 0);
        return "★".repeat(ratingValue) + "☆".repeat(5 - ratingValue);
    };

    return (
        <div className="admin-reviews-page">
            <div className="admin-reviews-page__header">
                <h2>Quản lý đánh giá</h2>
            </div>

            <form className="admin-reviews-page__filters" onSubmit={handleSearchSubmit}>
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
                            setRating(event.target.value);
                            setPage(0);
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

                <div className="admin-reviews-page__filter-group">
                    <label>Trạng thái đánh dấu</label>
                    <select
                        value={flag}
                        onChange={(event) => {
                            setFlag(event.target.value);
                            setPage(0);
                        }}
                    >
                        <option value="">Tất cả</option>
                        <option value="NORMAL">Bình thường</option>
                        <option value="NEGATIVE_FEEDBACK">Phản hồi tiêu cực</option>
                        <option value="ATTENTION_NEEDED">Cần chú ý</option>
                    </select>
                </div>

                <div className="admin-reviews-page__filter-group">
                    <label>xác nhận mua hàng</label>
                    <select
                        value={verified}
                        onChange={(event) => {
                            setVerified(event.target.value);
                            setPage(0);
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
                            setSortBy(event.target.value);
                            setPage(0);
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

                <div className="admin-reviews-page__filter-group">
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

                <div className="admin-reviews-page__filter-actions">
                    <button type="submit">Tìm kiếm</button>
                    <button type="button" onClick={handleReset}>
                        Đặt lại
                    </button>
                </div>
            </form>

            {error && <div className="admin-reviews-page__error">{error}</div>}

            {successMessage && (
                <div className="admin-reviews-page__success">{successMessage}</div>
            )}

            {loading ? (
                <p>Đang tải danh sách đánh giá...</p>
            ) : reviews.length === 0 ? (
                <div className="admin-reviews-page__empty">
                    <p>Không có đánh giá phù hợp.</p>
                </div>
            ) : (
                <>
                    <div className="admin-reviews-page__summary">
                        Tổng số đánh giá: <strong>{totalElements}</strong>
                    </div>

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
                                {reviews.map((review) => {
                                    const isUpdating = updatingReviewId === review.reviewId;

                                    return (
                                        <tr key={review.reviewId}>
                                            <td>#{review.reviewId}</td>
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

                    <div className="admin-reviews=page__pagination">
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

export default ReviewManagementPage;