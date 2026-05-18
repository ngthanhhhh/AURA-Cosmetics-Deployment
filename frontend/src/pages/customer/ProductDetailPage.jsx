import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { CartContext } from "../../context/CartContext";
import { productService } from "../../features/products/productService";
import ProductReviews from "./ProductReviews";

import "./ProductDetailPage.css";

function ProductDetailPage() {
  const { productId } = useParams();

  const { addItemToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);

    if (value < 1) {
      setQuantity(1);
      return;
    }

    if (product?.stock && value > product.stock) {
      setQuantity(product.stock);
      return;
    }

    setQuantity(value);
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);

      await addItemToCart(Number(productId), Number(quantity));

      setSuccessMessage("Đã thêm sản phẩm vào giỏ hàng.");
    } catch (error) {
      console.error("Add to cart error:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể thêm sản phẩm vào giỏ hàng"
      );
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <p className="product-detail__status">Đang tải...</p>;
  }

  if (!product) {
    return (
      <p className="product-detail__status">
        Không tìm thấy sản phẩm
      </p>
    );
  }

  const isOutOfStock = product.stock <= 0;

  // hỗ trợ cả image và imageUrl
  const imagePath = product.image || product.imageUrl;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/favicon.svg";

    if (imagePath.startsWith("http")) return imagePath;

    if (imagePath.startsWith("/uploads/")) {
      return `${API_BASE_URL.replace("/api/v1", "")}${imagePath}`;
    }

    if (imagePath.startsWith("uploads/")) {
      return `${API_BASE_URL.replace("/api/v1", "")}/${imagePath}`;
    }

    return `${API_BASE_URL.replace("/api/v1", "")}/uploads/products/${imagePath}`;
  };

  return (
    <div className="product-detail">
      <div className="product-detail__main">
        <div className="product-detail__image-box">
          <img
            src={getImageUrl(imagePath)}
            alt={product.name}
            className="product-detail__image"
          />
        </div>

        <div className="product-detail__info">
          <h1 className="product-detail__name">{product.name}</h1>

          <h2 className="product-detail__price">
            {Number(product.price).toLocaleString("vi-VN")} đ
          </h2>

          <p>
            <strong>Danh mục:</strong> {product.categoryName}
          </p>

          <p>
            <strong>Tồn kho:</strong> {product.stock}
          </p>

          <p className="product-detail__description">
            {product.description}
          </p>

          <div className="product-detail__cart-box">
            <label htmlFor="quantity">Số lượng:</label>

            <input
              id="quantity"
              type="number"
              min="1"
              max={product.stock || 1}
              value={quantity}
              onChange={handleQuantityChange}
              disabled={isOutOfStock}
              className="product-detail__quantity-input"
            />

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={addingToCart || isOutOfStock}
              className="product-detail__add-btn"
            >
              {isOutOfStock
                ? "Hết hàng"
                : addingToCart
                ? "Đang thêm..."
                : "Thêm vào giỏ"}
            </button>

            {successMessage && (
              <p className="product-detail__success">{successMessage}</p>
            )}
          </div>
        </div>
      </div>

      <div className="product-detail__reviews">
        <ProductReviews productId={productId} />
      </div>
    </div>
  );
}

export default ProductDetailPage;