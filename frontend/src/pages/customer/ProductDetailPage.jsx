import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productApi from "../../api/productApi";

function ProductDetailPage() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await productApi.getProductById(productId);
      setProduct(res.data);
    } catch (error) {
      console.error(error);
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

      {/* KHU VỰC REVIEW SẢN PHẨM */}
      {/* Nhóm trưởng sẽ gắn component review sản phẩm vào đây sau */}
      <div
        style={{
          marginTop: "40px",
          paddingTop: "24px",
          borderTop: "1px solid #ddd",
        }}
      >
        <h2>Đánh giá sản phẩm</h2>

        {/* TODO: Gắn component review ở đây */}
        {/* Ví dụ sau này:
            <ProductReviews productId={productId} />
        */}

        <p style={{ color: "#666" }}>
          Khu vực đánh giá sản phẩm sẽ được cập nhật sau.
        </p>
      </div>
    </div>
  );
}

export default ProductDetailPage;