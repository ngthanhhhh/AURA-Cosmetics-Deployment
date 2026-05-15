import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService } from "../../features/products/productService";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await productService.getAllProducts({
        keyword: keyword || undefined,
        page,
        size: 8,
        sortBy: "productId",
        direction: "asc",
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

  useEffect(() => {
    loadProducts();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    loadProducts();
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Danh sách sản phẩm</h2>

      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ padding: "10px", width: "250px" }}
        />

        <button
          type="submit"
          style={{ padding: "10px 16px", marginLeft: "8px" }}
        >
          Tìm kiếm
        </button>
      </form>

      {loading && <p>Đang tải...</p>}

      {!loading && products.length === 0 && <p>Không có sản phẩm nào</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.productId}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              textAlign: "center",
            }}
          >
            <img
              src={product.image || "/favicon.svg"}
              alt={product.name}
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />

            <h3>{product.name}</h3>
            <p>{product.categoryName}</p>
            <p>{Number(product.price).toLocaleString("vi-VN")} đ</p>
            <p>Kho: {product.stock}</p>

            <Link
              to={`/products/${product.productId}`}
              style={{
                display: "inline-block",
                marginTop: "10px",
                padding: "8px 12px",
                backgroundColor: "#111827",
                color: "white",
                textDecoration: "none",
                borderRadius: "6px",
              }}
            >
              Xem chi tiết
            </Link>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <button disabled={page <= 0} onClick={() => setPage(page - 1)}>
          Trang trước
        </button>

        <span style={{ margin: "0 12px" }}>
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