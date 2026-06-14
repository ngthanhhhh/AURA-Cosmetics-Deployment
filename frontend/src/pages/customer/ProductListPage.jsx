import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  LayoutList,
  ChevronDown,
  Star,
} from "lucide-react";

import { productService } from "../../features/products/productService";
import { categoryService } from "../../features/categories/categoryService";

import ScrollTopButton from "../../components/common/ScrollTopButton";
import "./ProductListPage.css";
import { notify } from "../../utils/notify";

/**
 * Trang danh sách sản phẩm dành cho khách hàng.
 *
 * Chức năng chính:
 * - Hiển thị danh sách sản phẩm.
 * - Tìm kiếm sản phẩm theo từ khóa.
 * - Lọc sản phẩm theo danh mục và khoảng giá.
 * - Sắp xếp sản phẩm theo nhiều tiêu chí.
 * - Đồng bộ bộ lọc với URL query params.
 * - Phân trang danh sách sản phẩm.
 * - Hiển thị đánh giá trung bình và số lượng đánh giá.
 */
function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("productId");
  const [direction, setDirection] = useState("asc");

  const [showSort, setShowSort] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);

  /**
   * Áp dụng bộ lọc và cập nhật query params trên URL.
   *
   * Hàm này gom các điều kiện lọc hiện tại hoặc giá trị ghi đè
   * rồi đưa vào URL để dữ liệu sản phẩm được tải lại theo bộ lọc mới.
   *
   * @param {Object} overrides Các giá trị bộ lọc cần ghi đè.
   * @param {number} nextPage Trang cần tải sau khi áp dụng bộ lọc.
   */
  const applyFilters = (overrides = {}, nextPage = 0) => {
    const nextKeyword = overrides.keyword ?? keyword;
    const nextCategoryId = overrides.categoryId ?? categoryId;
    const nextMinPrice = overrides.minPrice ?? minPrice;
    const nextMaxPrice = overrides.maxPrice ?? maxPrice;
    const nextSortBy = overrides.sortBy ?? sortBy;
    const nextDirection = overrides.direction ?? direction;

    const params = {};

    if (nextKeyword.trim()) params.keyword = nextKeyword.trim();
    if (nextCategoryId) params.categoryId = nextCategoryId;
    if (nextMinPrice) params.minPrice = nextMinPrice;
    if (nextMaxPrice) params.maxPrice = nextMaxPrice;

    params.sortBy = nextSortBy;
    params.direction = nextDirection;
    params.page = String(nextPage);

    setSearchParams(params);
  };

  /**
   * Tải danh sách danh mục sản phẩm.
   *
   * Danh mục được dùng để hiển thị trong bộ lọc danh mục
   * ở thanh tìm kiếm phía trên danh sách sản phẩm.
   */
  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories({
        page: 0,
        size: 100,
        sortBy: "categoryId",
        direction: "asc",
      });

      setCategories(data.content || []);
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
    }
  };

  /**
   * Tải danh sách sản phẩm theo bộ lọc hiện tại.
   *
   * Hàm nhận các điều kiện lọc, phân trang và sắp xếp,
   * sau đó gọi API để lấy danh sách sản phẩm tương ứng.
   *
   * @param {Object} filters Bộ lọc sản phẩm.
   * @param {string} filters.keyword Từ khóa tìm kiếm.
   * @param {string} filters.categoryId ID danh mục.
   * @param {string} filters.minPrice Giá thấp nhất.
   * @param {string} filters.maxPrice Giá cao nhất.
   * @param {number} filters.page Trang hiện tại.
   * @param {string} filters.sortBy Tiêu chí sắp xếp.
   * @param {string} filters.direction Hướng sắp xếp.
   */
  const loadProducts = async (filters) => {
    try {
      setLoading(true);

      const data = await productService.getAllProducts({
        keyword: filters.keyword || undefined,
        categoryId: filters.categoryId || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        page: filters.page,
        size: 20,
        sortBy: filters.sortBy,
        direction: filters.direction,
      });

      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
      notify.error("Không thể tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Tải danh mục một lần khi trang danh sách sản phẩm được mở.
   */
  useEffect(() => {
    loadCategories();
  }, []);

  /**
   * Đồng bộ bộ lọc từ URL query params vào state.
   *
   * Mỗi khi searchParams thay đổi, hệ thống sẽ:
   * - Đọc lại điều kiện lọc từ URL.
   * - Cập nhật state trên giao diện.
   * - Gọi API tải lại danh sách sản phẩm.
   */
  useEffect(() => {
    const currentFilters = {
      keyword: searchParams.get("keyword") || "",
      categoryId: searchParams.get("categoryId") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      sortBy: searchParams.get("sortBy") || "productId",
      direction: searchParams.get("direction") || "asc",
      page: Number(searchParams.get("page") || 0),
    };

    setKeyword(currentFilters.keyword);
    setCategoryId(currentFilters.categoryId);
    setMinPrice(currentFilters.minPrice);
    setMaxPrice(currentFilters.maxPrice);
    setSortBy(currentFilters.sortBy);
    setDirection(currentFilters.direction);
    setPage(currentFilters.page);

    loadProducts(currentFilters);
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);
  /**
   * Kiểm tra tính hợp lệ của khoảng giá.
   *
   * Giá từ và giá đến không được âm.
   * Nếu nhập cả hai giá trị thì giá từ không được lớn hơn giá đến.
   *
   * @returns {boolean} true nếu khoảng giá hợp lệ, false nếu không hợp lệ.
   */
  const validatePrice = () => {
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    if (min !== null && min < 0) {
      notify.warning("Giá từ không hợp lệ");
      return false;
    }

    if (max !== null && max < 0) {
      notify.warning("Giá đến không hợp lệ");
      return false;
    }

    if (min !== null && max !== null && min > max) {
      notify.warning("Giá từ không được lớn hơn giá đến");
      return false;
    }

    return true;
  };

  /**
   * Xử lý submit form tìm kiếm sản phẩm.
   *
   * Trước khi áp dụng bộ lọc, hàm kiểm tra khoảng giá.
   * Nếu hợp lệ, danh sách sản phẩm được tải lại từ trang đầu tiên.
   *
   * @param {Object} e Sự kiện submit form.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePrice()) return;

    applyFilters({}, 0);
  };

  /**
   * Reset toàn bộ bộ lọc về trạng thái mặc định.
   *
   * Hàm xóa query params trên URL, đồng thời đóng khung lọc
   * và menu sắp xếp nếu đang mở.
   */
  const handleReset = () => {
    setSearchParams({});
    setShowFilters(false);
    setShowSort(false);
  };

  /**
   * Chuyển trang danh sách sản phẩm.
   *
   * Khi đổi trang, các điều kiện lọc hiện tại vẫn được giữ nguyên.
   *
   * @param {number} nextPage Trang cần chuyển đến.
   */
  const handlePageChange = (nextPage) => {
    applyFilters({}, nextPage);
  };

  /**
   * Áp dụng tiêu chí sắp xếp sản phẩm.
   *
   * Sau khi chọn kiểu sắp xếp, menu sắp xếp được đóng lại
   * và danh sách sản phẩm được tải lại từ trang đầu tiên.
   *
   * @param {string} nextSortBy Tiêu chí sắp xếp.
   * @param {string} nextDirection Hướng sắp xếp.
   */
  const handleSort = (nextSortBy, nextDirection) => {
    setSortBy(nextSortBy);
    setDirection(nextDirection);
    setShowSort(false);

    applyFilters(
      {
        sortBy: nextSortBy,
        direction: nextDirection,
      },
      0
    );
  };

  <ScrollTopButton />

  return (
    <div className="discover-page">
      {/* Tiêu đề chính của trang khám phá sản phẩm */}
      <div className="discover-header">
        <span>✦</span>
        <h1>KHÁM PHÁ</h1>
        <span>✦</span>
      </div>

      <p className="discover-subtitle">
        Khám phá những sản phẩm làm đẹp được yêu thích nhất
      </p>

      {/* Khu vực tìm kiếm, lọc danh mục, lọc giá và sắp xếp sản phẩm */}
      <form className="discover-filter" onSubmit={handleSubmit}>
        <div className="discover-topbar">
          <div className="discover-category">
            <LayoutList size={19} />

            <select
              value={categoryId}
              onChange={(e) => {
                const selectedCategoryId = e.target.value;

                setCategoryId(selectedCategoryId);

                applyFilters(
                  {
                    categoryId: selectedCategoryId,
                  },
                  0
                );
              }}
            >
              <option value="">Danh mục</option>

              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="discover-search">
            <Search size={20} />

            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="discover-action-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={19} />
            Bộ lọc
          </button>

          <div className="discover-sort">
            <button
              type="button"
              className="discover-action-btn"
              onClick={() => setShowSort(!showSort)}
            >
              <ArrowUpDown size={19} />
              Sắp xếp
              <ChevronDown size={17} />
            </button>

            {showSort && (
              <div className="discover-sort-dropdown">
                <button type="button" onClick={() => handleSort("productId", "asc")}>
                  Mới nhất
                </button>

                <button type="button" onClick={() => handleSort("price", "asc")}>
                  Giá tăng dần
                </button>

                <button type="button" onClick={() => handleSort("price", "desc")}>
                  Giá giảm dần
                </button>

                <button type="button" onClick={() => handleSort("stock", "desc")}>
                  Tồn kho cao nhất
                </button>

                <button type="button" onClick={() => handleSort("averageRating", "desc")}>
                  Số sao cao nhất
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Khu vực nhập khoảng giá, chỉ hiển thị khi người dùng mở bộ lọc */}
        {showFilters && (
          <div className="discover-price-row">
            <div className="discover-price-left">
              <p>Khoảng giá</p>
            </div>

            <div className="discover-price-inputs">
              <div>
                <label>Giá từ</label>

                <input
                  type="number"
                  min="0"
                  placeholder="0 đ"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>

              <span>-</span>

              <div>
                <label>Giá đến</label>

                <input
                  type="number"
                  min="0"
                  placeholder="10.000.000 đ"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="discover-price-apply-btn"
                onClick={() => {
                  applyFilters(
                    {
                      minPrice: minPrice ? String(Number(minPrice) * 1000) : "",
                      maxPrice: maxPrice ? String(Number(maxPrice) * 1000) : "",
                    },
                    0
                  );
                }}
              >
                Lọc giá
              </button>
              <button
                type="button"
                className="discover-price-reset-btn"
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");

                  applyFilters(
                    {
                      minPrice: "",
                      maxPrice: "",
                    },
                    0
                  );
                }}
              >
                Xóa lọc
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Thông báo trạng thái khi đang tải sản phẩm */}
      {loading && <p className="discover-message">Đang tải sản phẩm...</p>}

      {/* Thông báo khi không có sản phẩm phù hợp với bộ lọc hiện tại */}
      {!loading && products.length === 0 && (
        <p className="discover-message">
          {categoryId || keyword || minPrice || maxPrice
            ? "Không tìm thấy sản phẩm phù hợp trong danh mục hoặc bộ lọc hiện tại"
            : "Không có sản phẩm nào"}
        </p>
      )}

      {/* Lưới hiển thị danh sách sản phẩm */}
      <div className="discover-grid">
        {products.map((product) => (
          <Link
            key={product.productId}
            to={`/products/${product.productId}`}
            className="discover-card-link"
          >
            <div className="discover-card">
              <img
                src={product.image || "/favicon.svg"}
                alt={product.name}
              />

              <div className="discover-card-content">
                <h3>{product.name}</h3>

                <p className="discover-category-name">
                  {product.categoryName}
                </p>

                <strong>
                  {Number(product.price).toLocaleString("vi-VN")} đ
                </strong>

                <div className="discover-rating">
                  <Star
                    size={14}
                    fill="#ff7b29"
                    color="#ff7b29"
                  />
                  <span>
                    {Number(product.averageRating || 0).toFixed(1)}
                    {" "}
                    ({product.reviewCount || 0} đánh giá)
                  </span>
                </div>

                <p className="discover-stock">
                  Kho: {product.stock}
                </p>

              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Phân trang danh sách sản phẩm */}
      <div className="discover-pagination">
        <button
          type="button"
          disabled={page <= 0}
          onClick={() => handlePageChange(page - 1)}
        >
          {"<"}
        </button>

        <span>{page + 1}</span>

        <button
          type="button"
          disabled={page + 1 >= totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          {">"}
        </button>
      </div>

      {/* Nút reset toàn bộ bộ lọc của trang danh sách sản phẩm */}
      <button
        type="button"
        className="discover-reset-btn"
        onClick={handleReset}
      >
        Reset bộ lọc
      </button>
      <ScrollTopButton />
    </div>
  
  );

}

export default ProductListPage;