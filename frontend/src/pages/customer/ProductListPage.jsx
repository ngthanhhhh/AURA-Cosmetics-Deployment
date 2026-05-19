import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { productService } from "../../features/products/productService";
import { categoryService } from "../../features/categories/categoryService";

import "./ProductListPage.css";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Dùng query params để giữ trạng thái lọc trên URL
  const [searchParams, setSearchParams] = useSearchParams();

  // State cho form lọc
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("productId");
  const [direction, setDirection] = useState("asc");

  // State phân trang
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

  const API_ORIGIN = API_BASE_URL.replace("/api/v1", "");

  // Xử lý ảnh: hỗ trợ ảnh upload /uploads, ảnh URL đầy đủ, hoặc fallback
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/favicon.svg";

    if (imagePath.startsWith("http")) return imagePath;

    if (imagePath.startsWith("/uploads/")) {
      return `${API_ORIGIN}${imagePath}`;
    }

    if (imagePath.startsWith("uploads/")) {
      return `${API_ORIGIN}/${imagePath}`;
    }

    return `${API_ORIGIN}/uploads/products/${imagePath}`;
  };

  // Lấy danh mục để đổ vào combobox
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

  // Lấy sản phẩm theo bộ lọc hiện tại
  const loadProducts = async (filters) => {
    try {
      setLoading(true);

      const data = await productService.getAllProducts({
        keyword: filters.keyword || undefined,
        categoryId: filters.categoryId || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        page: filters.page,
        size: 8,
        sortBy: filters.sortBy,
        direction: filters.direction,
      });

      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
      alert("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Load danh mục 1 lần khi mở trang
  useEffect(() => {
    loadCategories();
  }, []);

  // Mỗi khi URL query thay đổi thì đồng bộ state và gọi API
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

  // Tạo query params mới từ form lọc
  const buildSearchParams = (nextPage = 0) => {
    const params = {};

    if (keyword.trim()) params.keyword = keyword.trim();
    if (categoryId) params.categoryId = categoryId;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    params.sortBy = sortBy;
    params.direction = direction;
    params.page = String(nextPage);

    return params;
  };

  // Bấm Áp dụng mới gọi lọc, tránh việc đang nhập giá mà API gọi liên tục
  const handleFilterSubmit = (e) => {
    e.preventDefault();

    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    if (min !== null && min < 0) {
      alert("Giá thấp nhất không được âm");
      return;
    }

    if (max !== null && max < 0) {
      alert("Giá cao nhất không được âm");
      return;
    }

    if (min !== null && max !== null && min > max) {
      alert("Giá thấp nhất không được lớn hơn giá cao nhất");
      return;
    }

    setSearchParams(buildSearchParams(0));
  };

  // Reset toàn bộ bộ lọc
  const handleResetFilter = () => {
    setSearchParams({});
  };

  // Chuyển trang
  const handleChangePage = (nextPage) => {
    setSearchParams(buildSearchParams(nextPage));
  };

  return (
    <div className="product-list">
      <h2 className="product-list__title">Danh sách sản phẩm</h2>

      <form className="product-list__filter" onSubmit={handleFilterSubmit}>
        <input
          className="product-list__filter-input"
          type="text"
          placeholder="Tìm sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <select
          className="product-list__filter-input"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Tất cả danh mục</option>

          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          className="product-list__filter-input"
          type="number"
          min="0"
          placeholder="Giá thấp nhất"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          className="product-list__filter-input"
          type="number"
          min="0"
          placeholder="Giá cao nhất"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select
          className="product-list__filter-input"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="productId">Sắp xếp theo ID</option>
          <option value="name">Sắp xếp theo tên</option>
          <option value="price">Sắp xếp theo giá</option>
          <option value="stock">Sắp xếp theo tồn kho</option>
        </select>

        <select
          className="product-list__filter-input"
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
        >
          <option value="asc">Tăng dần</option>
          <option value="desc">Giảm dần</option>
        </select>

        <button className="product-list__filter-btn" type="submit">
          Áp dụng
        </button>

        <button
          className="product-list__filter-btn product-list__filter-btn--secondary"
          type="button"
          onClick={handleResetFilter}
        >
          Reset
        </button>
      </form>

      {loading && <p className="product-list__message">Đang tải...</p>}

      {!loading && products.length === 0 && (
        <p className="product-list__message">Không có sản phẩm nào</p>
      )}

      <div className="product-list__grid">
        {products.map((product) => {
          const imagePath = product.image || product.imageUrl;

          return (
            <div className="product-list__card" key={product.productId}>
              <img
                className="product-list__image"
                src={getImageUrl(imagePath)}
                alt={product.name}
              />

              <h3 className="product-list__name">{product.name}</h3>

              <p className="product-list__category">{product.categoryName}</p>

              <p className="product-list__price">
                {Number(product.price).toLocaleString("vi-VN")} đ
              </p>

              <p className="product-list__stock">Kho: {product.stock}</p>

              <Link
                className="product-list__detail-link"
                to={`/products/${product.productId}`}
              >
                Xem chi tiết
              </Link>
            </div>
          );
        })}
      </div>

      <div className="product-list__pagination">
        <button
          type="button"
          disabled={page <= 0}
          onClick={() => handleChangePage(page - 1)}
        >
          Trang trước
        </button>

        <span>
          Trang {page + 1} / {totalPages || 1}
        </span>

        <button
          type="button"
          disabled={page + 1 >= totalPages}
          onClick={() => handleChangePage(page + 1)}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}

export default ProductListPage;