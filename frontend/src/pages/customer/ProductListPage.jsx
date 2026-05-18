import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { productService } from "../../features/products/productService";
import { categoryService } from "../../features/categories/categoryService";

import "./ProductListPage.css";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("productId");
  const [direction, setDirection] = useState("asc");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await productService.getAllProducts({
        keyword: keyword || undefined,
        categoryId: categoryId || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        page,
        size: 8,
        sortBy,
        direction,
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

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page, sortBy, direction]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadProducts();
  };

  const handleResetFilter = () => {
    setKeyword("");
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("productId");
    setDirection("asc");
    setPage(0);
  };

  useEffect(() => {
    if (
      keyword === "" &&
      categoryId === "" &&
      minPrice === "" &&
      maxPrice === "" &&
      sortBy === "productId" &&
      direction === "asc"
    ) {
      loadProducts();
    }
  }, [keyword, categoryId, minPrice, maxPrice, sortBy, direction]);

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
          placeholder="Giá thấp nhất"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          className="product-list__filter-input"
          type="number"
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
        {products.map((product) => (
          <div className="product-list__card" key={product.productId}>
            <img
              className="product-list__image"
              src={product.image || "/favicon.svg"}
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
        ))}
      </div>

      <div className="product-list__pagination">
        <button disabled={page <= 0} onClick={() => setPage(page - 1)}>
          Trang trước
        </button>

        <span>
          Trang {page + 1} / {totalPages || 1}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}

export default ProductListPage;