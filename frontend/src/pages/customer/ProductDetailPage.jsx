import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { CartContext } from "../../context/CartContext";
import { productService } from "../../features/products/productService";
import ProductReviews from "./ProductReviews";

import "./ProductDetailPage.css";

function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { addItemToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

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

      alert("Đã thêm sản phẩm vào giỏ hàng");

      navigate("/cart");
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

  if (loading) return <p className="product-detail__status">Đang tải...</p>;

  if (!product) {
    return <p className="product-detail__status">Không tìm thấy sản phẩm</p>;
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="product-detail">
      <div className="product-detail__main">
        <div className="product-detail__image-box">
          <img
            src={product.image || "/favicon.svg"}
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
          </div>
        </div>
      </div>

      {/* KHU VỰC REVIEW SẢN PHẨM */}
      <div className="product-detail__reviews">
        <ProductReviews productId={productId} />
      </div>
    </div>
  );
}

export default ProductDetailPage;