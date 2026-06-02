import { useState, useEffect } from "react";

import { Filter } from "lucide-react";

import { reviewService } from "../../features/reviews/reviewService";
import { formatDate } from "../../utils/formatDate";
import "./ProductReviews.css";

/**
 * Component hiển thị và xử lý đánh giá sản phẩm.
 *
 * Chức năng chính:
 * - Hiển thị tổng quan điểm đánh giá của sản phẩm.
 * - Hiển thị thống kê số lượng đánh giá theo từng mức sao.
 * - Tìm kiếm, lọc và sắp xếp danh sách đánh giá.
 * - Gửi đánh giá mới cho sản phẩm.
 * - Phân trang danh sách đánh giá.
 *
 * @param {Object} props Props truyền vào component.
 * @param {number|string} props.productId ID của sản phẩm cần hiển thị đánh giá.
 */
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

    const [showFilters, setShowFilters] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const [ratingSummary, setRatingSummary] = useState({
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    });

    /**
     * Tải danh sách đánh giá của sản phẩm.
     *
     * Hàm gọi API lấy đánh giá theo các điều kiện hiện tại:
     * số sao, trạng thái xác nhận mua hàng, từ khóa tìm kiếm,
     * phân trang và sắp xếp.
     *
     * Nếu tải thành công, dữ liệu tổng quan được lưu vào reviewData
     * và danh sách đánh giá được lưu vào reviews.
     */
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

    /**
     * Tải thống kê số lượng đánh giá theo từng mức sao.
     *
     * Hàm lấy danh sách đánh giá của sản phẩm, sau đó đếm số lượng
     * đánh giá 5 sao, 4 sao, 3 sao, 2 sao và 1 sao để hiển thị
     * trong khu vực tổng quan đánh giá.
     */
    const fetchRatingSummary = async () => {
        if (!productId) return;

        try {
            const allData = await reviewService.getProductReviews(productId, {
                page: 0,
                size: 100,
                sortBy: "createdAt",
                sortDir: "desc",
            });

            console.log("ALL REVIEW DATA:", allData);

            const allReviews = allData?.reviews || [];

            const summary = {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0,
            };

            allReviews.forEach((review) => {
                const star = parseInt(review.rating, 10);

                if (summary[star] !== undefined) {
                    summary[star] += 1;
                }
            });

            setRatingSummary(summary);
        } catch (err) {
            console.error("Fetch rating summary error:", err);
        }
    };

    /**
     * Tải lại đánh giá khi sản phẩm, trang, bộ lọc hoặc sắp xếp thay đổi.
     */
    useEffect(() => {
        fetchReviews();
        fetchRatingSummary();
    }, [productId, page, rating, verified, sortBy, sortDir]);

    /**
     * Xử lý tìm kiếm đánh giá theo từ khóa.
     *
     * Khi người dùng submit form tìm kiếm, trang hiện tại được đưa về trang đầu
     * và danh sách đánh giá được tải lại theo từ khóa đang nhập.
     *
     * @param {Object} event Sự kiện submit form tìm kiếm.
     */
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setPage(0);
        fetchReviews();
    };

    /**
     * Đặt lại bộ lọc đánh giá về trạng thái mặc định.
     *
     * Hàm xóa bộ lọc số sao, trạng thái xác nhận mua hàng,
     * từ khóa tìm kiếm, tiêu chí sắp xếp và đưa phân trang về trang đầu.
     */
    const handleReset = () => {
        setRating("");
        setVerified("");
        setKeyword("");
        setSortBy("createdAt");
        setSortDir("desc");
        setPage(0);
    };

    /**
     * Gửi đánh giá mới cho sản phẩm.
     *
     * Hàm lấy số sao và nội dung bình luận từ form,
     * gọi API tạo đánh giá mới, sau đó reset form, đóng form đánh giá
     * và tải lại danh sách cùng thống kê đánh giá.
     *
     * @param {Object} event Sự kiện submit form đánh giá.
     */
    const handleSubmitReview = async (event) => {
        event.preventDefault();

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
            setShowReviewForm(false);
            fetchReviews();
            fetchRatingSummary();
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

    /**
     * Chuyển điểm đánh giá dạng số thành chuỗi ký tự sao.
     *
     * Ví dụ: rating là 4 thì trả về 4 sao đặc và 1 sao rỗng.
     *
     * @param {number|string} value Giá trị điểm đánh giá.
     * @returns {string} Chuỗi biểu diễn sao đánh giá.
     */
    const renderStars = (value) => {
        const ratingValue = Math.round(Number(value || 0));

        return "★".repeat(ratingValue) + "☆".repeat(5 - ratingValue);
    };

    return (
        <section className="product-reviews">
            {/* Khu vực tổng quan điểm đánh giá và thao tác nhanh */}
            <div className="product-reviews__summary">
                <div className="product-reviews__summary-left">
                    <h3>ĐÁNH GIÁ ({reviewData?.totalReviews || 0})</h3>

                    <div className="product-reviews__score">
                        {Number(reviewData?.averageRating || 0).toFixed(1)}
                    </div>

                    <div className="product-reviews__stars">
                        {renderStars(reviewData?.averageRating || 0)}
                    </div>

                    <p>{reviewData?.totalReviews || 0} đánh giá</p>
                </div>

                {/* Khu vực thống kê số lượng đánh giá theo từng mức sao */}
                <div className="product-reviews__summary-center">
                    <button type="button">Tất cả ({reviewData?.totalReviews || 0})</button>
                    <button type="button">5 ★ ({ratingSummary[5]})</button>
                    <button type="button">4 ★ ({ratingSummary[4]})</button>
                    <button type="button">3 ★ ({ratingSummary[3]})</button>
                    <button type="button">2 ★ ({ratingSummary[2]})</button>
                    <button type="button">1 ★ ({ratingSummary[1]})</button>            
                </div>

                <button
                    type="button"
                    className="product-reviews__filter-toggle"
                    onClick={() => setShowFilters((prev) => !prev)}
                >
                    <Filter size={28} />
                </button>

                {/* Khu vực mở form viết đánh giá */}
                <div className="product-reviews__write-box">
                    <p>Chia sẻ nhận xét của bạn về sản phẩm này</p>

                    <button
                        type="button"
                        onClick={() => setShowReviewForm((prev) => !prev)}
                    >
                        Viết đánh giá
                    </button>
                </div>
            </div>

            {/* Thông báo lỗi khi tải hoặc gửi đánh giá thất bại */}
            {error && <div className="product-reviews__error">{error}</div>} 

            {/* Thông báo thành công sau khi gửi đánh giá */}
            {successMessage && (
                <div className="product-reviews__success">{successMessage}</div>
            )}  

            {/* Form tìm kiếm, lọc và sắp xếp đánh giá */}
            {showFilters && (
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
                            <option value="2">2 sao</option>
                            <option value="1">1 sao</option>
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
            )}
 
            {/* Form gửi đánh giá mới cho sản phẩm */}
            {showReviewForm && (
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
            )}

            {/* Khu vực hiển thị trạng thái tải, trạng thái rỗng hoặc danh sách đánh giá */}
            {loading ? (
                <p>Đang tải đánh giá...</p>
            ) : reviews.length === 0 ? (
                <div className="product-reviews__empty">
                    <p>Chưa  có đánh giá phù hợp.</p>
                </div>
            ) : (
                <>
                    {/* Danh sách các đánh giá của sản phẩm */}
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

                    {/* Phân trang danh sách đánh giá */}
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