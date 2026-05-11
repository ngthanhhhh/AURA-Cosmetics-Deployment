import { useState, useEffect } from "react";

import { reviewService } from "../../features/reviews/reviewService";
import { formatDate } from "../../utils/formatDate";
import "./ProductReviews.css";

function ProductReviews({productId}) {
    const [reviewData, setReviewData] = useState(null);
    const [reviews, setReviews] = useState([]);
    
    const [rating, setRating] = useState("");
    const [verified, setVerified] = useState("");
    const [keyword, setKeyword] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortDir, setSortDir] = useState("desc");

    const [page, setPage] = useState(0);
    const [size] = useState(5);

    const [newRating, setNewRating] = useState(5);
    const [comment, setComment] = useState("");

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchReviews = async () => {
        if (!productId) return;

        try {
            setLoading(true);
            setError("");

            const data = await reviewService.getProductReviews(productId, {
                rating: rating || undefined,
                verified: verified === "" ? undefined : verified === "true",
                keyword: keyword.trim() || undefined,
                page,
                size,
                sortBy,
                sortDir
            });

            setReviewData(data);
            setReviews(data?.reviews || []);
        } catch (err) {
            console.error("Fetch product reviews error: ", err);

            setError(
                err?.response?.data?.message ||
                "Không thể tải đánh giá sản phẩm. Vui lòng thử lại sau!"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId, page, rating, verified, sortBy, sortDir]);

    const handleSearchSubmit = (event) => {
        event.prenventDefault();
        setPage(0);
        fetchReviews();
    };

    const handleReset = () => {
        setRating("");
        setVerified("");
        setKeyword("");
        setSortBy("createdAt");
        setSortDir("desc");
        setPage(0);
    };

    const handleSubmitReview = async (event) => {
        event.prenventDefault();

        try {
            setSubmitting(true);
            setError("");
            setSuccessMessage("");

            await reviewService.createReview(productId, {
                rating: Number(newRating),
                comment: comment.trim() || null
            });

            setSuccessMessage("Gửi đánh giá thành công.");
            setNewRating(5);
            setComment("");
            setPage(0);
            fetchReviews();
        } catch (err) {
            console.error("Create review error: ", err);

            setError(
                err?.response?.data?.message ||
                "Không thể gửi đánh giá. Vui lòng đăng nhập và thử lại."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (value) => {
        const ratingValue = Math.round(Number(value || 0));

        return "★".repeat(ratingValue) + "☆".repeat(5 - ratingValue);
    };

    return (
        <section className="product-reviews">
            <div className="product-reviews__header">
                <div>
                    <h3>Đánh giá sản phẩm</h3>
                    <p>
                        Điểm trung bình:{" "}
                        <strong>{Number(reviewData?.averageRating || 0).toFixed(1)}/5</strong>
                        {" . "}
                        Tổng đánh giá: <strong>{reviewData?.totalReviews || 0}</strong>
                    </p>
                </div>
            </div>

            {error && <div className="product-reviews__error">{error}</div>} 

            {successMessage && (
                <div className="product-reviews__success">{successMessage}</div>
            )}          

            <form className="product-reviews__form" onSubmit={handleSubmitReview}>
                <h4>Gửi đánh giá của bạn</h4>

                <div className="product-reviews__form-row">
                    <div className="product-reviews__field">
                        <label>Số sao</label>
                        <select
                            value={newRating}
                            onChange={(event) => setNewRating(event.target.value)}
                        >
                            <option value="5">5 sao</option>
                            <option value="4">4 sao</option>
                            <option value="3">3 sao</option>
                            <option value="2">2 sao</option>
                            <option value="1">1 sao</option>
                        </select>
                    </div>

                    <div className="product-reviews__field product-reviews__field--full">
                        <label>Bình luận</label>
                        <textarea
                            value={comment}
                            onChange={(event) => setComment(event.target.value)}
                            placeholder="Nhập nội dung đánh giá"
                            rows="3"
                        />
                    </div>
                </div>

                <button type="submit" disabled={submitting}>
                    {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
            </form>

            <form className="product-reviews__filters" onSubmit={handleSearchSubmit}>
                <div className="product-reviews__field">
                    <label>Tìm kiếm</label>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="Tìm trong bình luận"
                    />
                </div>

                <div className="product-reviews__field">
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
                        <option value="2 sao">2 sao</option>
                        <option value="1">1</option>
                    </select>
                </div>

                <div className="product-reviews__field">
                    <label>Xác nhận mua hàng</label>
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

                <div className="product-reviews__field">
                    <label>Sắp xếp theo</label>
                    <select
                        value={sortBy}
                        onChange={(event) => {
                            setSortBy(event.target.value);
                            setPage(0);
                        }}
                    >
                        <option value="createdAt">Thời gian tạo</option>
                        <option value="rating">Số sao</option>
                        <option value="reviewId">Mã đánh giá</option>
                        <option value="isVerifiedPurchase">Xác nhận mua hàng</option>
                    </select>
                </div>

                <div className="product-reviews__field">
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

                <div className="product-reviews__filter-actions">
                    <button type="submit">Tìm kiếm</button>
                    <button type="button" onClick={handleReset}>
                        Đặt lại
                    </button>
                </div>
            </form> 

            {loading ? (
                <p>Đang tải đánh giá...</p>
            ) : reviews.length === 0 ? (
                <div className="product-reviews__empty">
                    <p>Chưa  có đánh giá phù hợp.</p>
                </div>
            ) : (
                <>
                    <div className="product-reviews__list">
                        {reviews.map((review) => (
                            <article key={review.reviewId} className="product-reviews__item">
                                <div className="product-reviews__item-header">
                                    <div>
                                        <strong>{review.userName}</strong>
                                        <div className="product-reviews__starts">
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>

                                    <span>{formatDate(review.createdAt)}</span>
                                </div>

                                {review.isVerifiedPurchase && (
                                    <div className="product-reviews__verified">
                                        Xác nhận đã mua hàng
                                    </div>
                                )}

                                <p>{review.comment || "Người dùng không để lại bình luận."}</p>
                            </article>
                        ))}
                    </div>

                    <div className="product-reviews__pagination">
                        <button
                            type="button"
                            disabled={reviewData?.first || page <= 0}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            Trang trước
                        </button>

                        <span>
                            Trang {(reviewData?.pageNumber || 0) + 1} / {" "}
                            {reviewData?.totalPages || 1}
                        </span>

                        <button
                            type="button"
                            disabled={reviewData?.last || page + 1 >= (reviewData?.totalPages || 1)}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            Trang sau
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}

export default ProductReviews;