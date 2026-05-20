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

  const loadProducts = async (filters) => {
    try {
      setLoading(true);

      const data = await productService.getAllProducts({
        keyword: filters.keyword || undefined,
        categoryId: filters.categoryId || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        page: filters.page,
        size: 12,
        sortBy: filters.sortBy,
        direction: filters.direction,
      });

      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
      alert("Không thể tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

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

  const validatePrice = () => {
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    if (min !== null && min < 0) {
      alert("Giá từ không hợp lệ");
      return false;
    }

    if (max !== null && max < 0) {
      alert("Giá đến không hợp lệ");
      return false;
    }

    if (min !== null && max !== null && min > max) {
      alert("Giá từ không được lớn hơn giá đến");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePrice()) return;

    applyFilters({}, 0);
  };

  const handleReset = () => {
    setSearchParams({});
    setShowFilters(false);
    setShowSort(false);
  };

  const handlePageChange = (nextPage) => {
    applyFilters({}, nextPage);
  };

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
      <div className="discover-header">
        <span>✦</span>
        <h1>KHÁM PHÁ</h1>
        <span>✦</span>
      </div>

      <p className="discover-subtitle">
        Khám phá những sản phẩm làm đẹp được yêu thích nhất
      </p>

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

      {loading && <p className="discover-message">Đang tải sản phẩm...</p>}

      {!loading && products.length === 0 && (
        <p className="discover-message">
          {categoryId || keyword || minPrice || maxPrice
            ? "Không tìm thấy sản phẩm phù hợp trong danh mục hoặc bộ lọc hiện tại"
            : "Không có sản phẩm nào"}
        </p>
      )}

      <div className="discover-grid">
        {products.map((product) => (
          <div className="discover-card" key={product.productId}>
            <img
              src={product.image || "/favicon.svg"}
              alt={product.name}
            />

            <div className="discover-card-content">
              <h3>{product.name}</h3>

              <p className="discover-category-name">{product.categoryName}</p>

              <strong>
                {Number(product.price).toLocaleString("vi-VN")} đ
              </strong>

                <div className="discover-rating">
                  <Star size={14} fill="#ff7b29" color="#ff7b29" />
                  <span>
                    {Number(product.averageRating || 0).toFixed(1)}
                    {" "}
                    ({product.reviewCount || 0} đánh giá)
                  </span>
                </div>

              <p className="discover-stock">Kho: {product.stock}</p>

              <Link to={`/products/${product.productId}`}>
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>

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