import { useState, useEffect } from "react";

import { Filter } from "lucide-react";

import { reviewService } from "../../features/reviews/reviewService";
import { formatDate } from "../../utils/formatDate";
import "./ProductReviews.css";

function ProductReviews({productId}) {
    // State lưu dữ liệu tổng của API đánh giá trả về.
    // VD: reviews, totalPages, totalElements, averageRating,...
    const [reviewData, setReviewData] = useState(null);
    // State lưu danh sách đánh giá hiện tại để render ra giao diện.
    const [reviews, setReviews] = useState([]);
    
    // State lọc theo số sao đánh giá.
    const [rating, setRating] = useState("");
    const [verified, setVerified] = useState(""); // State lọc theo verified purchase, tức đánh giá từ người đã mua hàng.
    const [keyword, setKeyword] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortDir, setSortDir] = useState("desc");

    const [page, setPage] = useState(0);

    // State lưu số đánh giá trên mỗi trang.
    // Ở đây cố định là 5 nên không cần setter.
    const [size] = useState(5);

    const [newRating, setNewRating] = useState(5); // State lưu số sao khi người dùng gửi đánh giá mới.
    const [comment, setComment] = useState(""); // State lưu nội dung bình luận khi người dùng gửi đánh giá mới.

    // State kiểm tra component có đang tải danh sách đánh giá hay không.
    const [loading, setLoading] = useState(false);
    // State kiểm tra form gửi đánh giá có đang submit hay không.
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // State lưu thông báo thành công sau khi gửi đánh giá.

    const [showFilters, setShowFilters] = useState(false); // State điều khiển việc ẩn/hiện khối bộ lọc đánh giá.
    const [showReviewForm, setShowReviewForm] = useState(false); // State điều khiển việc ẩn/hiện form gửi đánh giá.

    const [ratingSummary, setRatingSummary] = useState({ // State lưu thống kê số lượng đánh giá theo từng mức sao.
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    });

    const fetchReviews = async () => {
        if (!productId) return; // Nếu chưa có productId thì không gọi API.

        try {
            // Bật loading và xóa lỗi cũ.
            setLoading(true);
            setError("");

            // Gọi service lấy đánh giá sản phẩm.
            const data = await reviewService.getProductReviews(productId, {
                rating: rating || undefined, // Nếu rating rỗng thì gửi undefined để không lọc theo sao.
                verified: verified === "" ? undefined : verified === "true",
                keyword: keyword.trim() || undefined,
                page,
                size,
                sortBy,
                sortDir
            });

            setReviewData(data); // Lưu toàn bộ dữ liệu đánh giá trả về.
            setReviews(data?.reviews || []); // Lưu riêng danh sách review để render.
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

    const fetchRatingSummary = async () => {
        if (!productId) return; // Nếu chưa có productId thì không gọi API.

        try {
            // Gọi API lấy danh sách review để tổng hợp rating.
            const allData = await reviewService.getProductReviews(productId, {
                page: 0,
                size: 100,
                sortBy: "createdAt",
                sortDir: "desc",
            });

            console.log("ALL REVIEW DATA:", allData);

            // Lấy danh sách review, nếu không có thì dùng mảng rỗng.
            const allReviews = allData?.reviews || [];

            // Khởi tạo object đếm số lượng review theo từng mức sao.
            const summary = {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0,
            };

            // Duyệt từng review để cộng số lượng vào mức sao tương ứng.
            allReviews.forEach((review) => {
                const star = parseInt(review.rating, 10); // Chuyển rating về số nguyên.

                // Nếu star nằm trong 1 đến 5 thì tăng số lượng.
                if (summary[star] !== undefined) {
                    summary[star] += 1;
                }
            });

            setRatingSummary(summary); // Lưu thống kê rating vào state.
        } catch (err) {
            console.error("Fetch rating summary error:", err);
        }
    };

    useEffect(() => {
        fetchReviews();
        fetchRatingSummary();
    }, [productId, page, rating, verified, sortBy, sortDir]);

    const handleSearchSubmit = (event) => {
        event.preventDefault(); // Ngăn form reload lại trang.
        setPage(0); // Khi tìm kiếm mới thì quay về trang đầu tiên.
        fetchReviews(); // Gọi lại API với keyword hiện tại.
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
        event.preventDefault(); // Ngăn form reload lại trang.

        try {
            setSubmitting(true); // Bật trạng thái đang gửi đánh giá.
            setError("");
            setSuccessMessage("");

            await reviewService.createReview(productId, {
                rating: Number(newRating),
                comment: comment.trim() || null
            });

            setSuccessMessage("Gửi đánh giá thành công.");

            // Reset form đánh giá về mặc định.
            setNewRating(5);
            setComment("");
            
            // Quay về trang đầu để thấy đánh giá mới nhất.
            setPage(0);
            setShowReviewForm(false); // Ẩn form sau khi gửi thành công.
            
            // Tải lại danh sách đánh giá và thống kê rating.
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

    const renderStars = (value) => {
        // Làm tròn và chuyển value về number, nếu không có thì mặc định là 0.
        const ratingValue = Math.round(Number(value || 0));

        // Tạo số sao đặc tương ứng ratingValue và sao rỗng cho phần còn lại.
        return "★".repeat(ratingValue) + "☆".repeat(5 - ratingValue);
    };

    return (
        <section className="product-reviews">
            <div className="product-reviews__summary">
                {/* Phần bên trái: tổng số đánh giá, điểm trung bình và sao trung bình */}
                <div className="product-reviews__summary-left">
                    {/* Hiển thị tổng số đánh giá, nếu chưa có dữ liệu thì mặc định là 0 */}
                    <h3>ĐÁNH GIÁ ({reviewData?.totalReviews || 0})</h3>

                    <div className="product-reviews__score">
                        {/* Hiển thị điểm trung bình, làm tròn 1 chữ số thập phân */}
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

                {/* Nút ẩn/hiện bộ lọc đánh giá */}
                <button
                    type="button"
                    className="product-reviews__filter-toggle"
                    onClick={() => setShowFilters((prev) => !prev)}
                >
                    <Filter size={28} />  {/* Icon filter lấy từ thư viện lucide-react */}
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

            {showFilters && (
                <form className="product-reviews__filters" onSubmit={handleSearchSubmit}>
                    {/* Ô tìm kiếm trong nội dung bình luận */}
                    <div className="product-reviews__field">
                        <label>Tìm kiếm</label>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                            placeholder="Tìm trong bình luận"
                        />
                    </div>

                    {/* Bộ lọc theo số sao */}
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

                    {/* Bộ lọc theo trạng thái xác nhận đã mua hàng */}
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

                    {/* Chọn trường dùng để sắp xếp đánh giá */}
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

                    {/* Chọn chiều sắp xếp */}
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

                    {/* Nút tìm kiếm và đặt lại bộ lọc */}
                    <div className="product-reviews__filter-actions">
                        <button type="submit">Tìm kiếm</button>
                        <button type="button" onClick={handleReset}>
                            Đặt lại
                        </button>
                    </div>
                </form>
            )}
 
            {showReviewForm && (
                <form className="product-reviews__form" onSubmit={handleSubmitReview}>
                    <h4>Gửi đánh giá của bạn</h4>

                    <div className="product-reviews__form-row">
                        {/* Chọn số sao cho đánh giá mới */}
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
                                {/* Header của từng review: tên người dùng, sao, ngày tạo */}
                                <div className="product-reviews__item-header">
                                    <div>
                                        {/* Tên người đánh giá */}
                                        <strong>{review.userName}</strong>
                                        {/* Số sao của đánh giá */}
                                        <div className="product-reviews__stars"> 
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>

                                    {/* Ngày tạo đánh giá */}
                                    <span>{formatDate(review.createdAt)}</span>
                                </div>

                                {/* Chỉ hiển thị badge này nếu review là từ người đã mua hàng */}
                                {review.isVerifiedPurchase && (
                                    <div className="product-reviews__verified">
                                        Xác nhận đã mua hàng
                                    </div>
                                )}

                                {/* Nội dung bình luận, nếu rỗng thì hiển thị text mặc định */}
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

                        {/* Hiển thị trang hiện tại / tổng số trang */}
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