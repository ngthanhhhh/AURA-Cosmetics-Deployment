import { useEffect, useState } from "react";
import productApi from "../../api/productApi";
import { Link } from "react-router-dom";

function ProductListPage() {
  // Danh sách sản phẩm lấy từ backend
  const [products, setProducts] = useState([]);

  // Từ khóa tìm kiếm
  const [keyword, setKeyword] = useState("");

  // Trang hiện tại, backend đang dùng page bắt đầu từ 0
  const [page, setPage] = useState(0);

  // Tổng số trang backend trả về
  const [totalPages, setTotalPages] = useState(0);

  // Trạng thái loading khi đang gọi API
  const [loading, setLoading] = useState(false);

  // Hàm gọi API lấy danh sách sản phẩm
  const loadProducts = async () => {
    try {
      setLoading(true);

      const res = await productApi.getAllProducts({
        keyword: keyword || undefined,
        page: page,
        size: 8,
        sortBy: "productId",
        direction: "asc",
      });

      setProducts(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
      alert("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Mỗi khi đổi trang thì gọi lại API
  useEffect(() => {
    loadProducts();
  }, [page]);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();

    // Khi tìm kiếm thì quay về trang đầu
    setPage(0);

    // Gọi lại API với keyword mới
    loadProducts();
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Danh sách sản phẩm</h2>

      {/* FORM TÌM KIẾM */}
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

      {/* HIỂN THỊ LOADING */}
      {loading && <p>Đang tải...</p>}

      {/* KHI KHÔNG CÓ SẢN PHẨM */}
      {!loading && products.length === 0 && <p>Không có sản phẩm nào</p>}

      {/* DANH SÁCH CARD SẢN PHẨM */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          // Đây là 1 CARD SẢN PHẨM
          <div
            key={product.productId}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              textAlign: "center",
            }}
          >
            {/* ẢNH SẢN PHẨM */}
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

            {/* TÊN SẢN PHẨM */}
            <h3>{product.name}</h3>

            {/* TÊN DANH MỤC */}
            <p>{product.categoryName}</p>

            {/* GIÁ */}
            <p>{Number(product.price).toLocaleString("vi-VN")} đ</p>

            {/* TỒN KHO */}
            <p>Kho: {product.stock}</p>


            {/* LINK XEM CHI TIẾT SẢN PHẨM */}
            <a
              href={`/products/${product.productId}`}
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
            </a>
          </div>
        ))}
      </div>

      {/* PHÂN TRANG */}
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