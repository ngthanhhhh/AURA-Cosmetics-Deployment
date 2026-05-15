import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productService } from "../../features/products/productService";

function ProductDetailPage() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadProduct = async () => {
    try {
      setLoading(true);

      const data = await productService.getProductById(productId);

      setProduct(data);
    } catch (error) {
      console.error("Lỗi tải chi tiết sản phẩm:", error);
      alert("Không thể tải chi tiết sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [productId]);

  if (loading) return <p>Đang tải...</p>;

  if (!product) return <p>Không tìm thấy sản phẩm</p>;

  return (
    <div style={{ padding: "40px" }}>
      <h1>{product.name}</h1>

      <img
        src={product.image || "/favicon.svg"}
        alt={product.name}
        style={{
          width: "300px",
          height: "300px",
          objectFit: "cover",
          borderRadius: "12px",
        }}
      />

      <h2>{Number(product.price).toLocaleString("vi-VN")} đ</h2>

      <p>Danh mục: {product.categoryName}</p>
      <p>Tồn kho: {product.stock}</p>
      <p>{product.description}</p>

      <div
        style={{
          marginTop: "40px",
          paddingTop: "24px",
          borderTop: "1px solid #ddd",
        }}
      >
        <h2>Đánh giá sản phẩm</h2>

        <p style={{ color: "#666" }}>
          Khu vực đánh giá sản phẩm sẽ được cập nhật sau.
        </p>
      </div>
    </div>
  );
}

export default ProductDetailPage;