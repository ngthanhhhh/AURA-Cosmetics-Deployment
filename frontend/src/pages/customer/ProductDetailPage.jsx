import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { CartContext } from "../../context/CartContext";
import { productService } from "../../features/products/productService";
import ProductReviews from "./ProductReviews";

import ScrollTopButton from "../../components/common/ScrollTopButton";

import "./ProductDetailPage.css";

import { notify } from "../../utils/notify";

/**
 * Trang chi tiết sản phẩm.
 *
 * Chức năng chính:
 * - Lấy productId từ URL.
 * - Tải thông tin chi tiết sản phẩm.
 * - Hiển thị ảnh, tên, giá, danh mục, tồn kho và mô tả sản phẩm.
 * - Cho phép người dùng chọn số lượng hợp lệ.
 * - Thêm sản phẩm vào giỏ hàng.
 * - Hiển thị khu vực đánh giá sản phẩm.
 */
function ProductDetailPage() {
  const { productId } = useParams();

  const { addItemToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  /**
   * Tải thông tin chi tiết sản phẩm theo productId.
   *
   * productId được lấy từ tham số trên URL.
   * Trong lúc gọi API, loading được bật để hiển thị trạng thái đang tải.
   * Nếu gọi API thành công, dữ liệu sản phẩm sẽ được lưu vào state product.
   */
  const loadProduct = async () => {
    try {
      setLoading(true);

      const data = await productService.getProductById(productId);

      setProduct(data);
    } catch (error) {
      console.error("Lỗi tải chi tiết sản phẩm:", error);
      notify.error("Không thể tải chi tiết sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Tải lại chi tiết sản phẩm khi productId trên URL thay đổi.
   */
  useEffect(() => {
    loadProduct();
  }, [productId]);

  /**
   * Xử lý thay đổi số lượng sản phẩm.
   *
   * Nếu số lượng nhỏ hơn 1, hệ thống tự động đưa về 1.
   * Nếu số lượng vượt quá tồn kho, hệ thống tự động đưa về số lượng tồn kho.
   *
   * @param {Object} e Sự kiện thay đổi giá trị input số lượng.
   */
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

  /**
   * Thêm sản phẩm hiện tại vào giỏ hàng.
   *
   * Hàm gọi addItemToCart từ CartContext với productId và quantity.
   * Trong lúc xử lý, addingToCart được bật để khóa nút thêm vào giỏ.
   * Nếu thêm thành công, hiển thị thông báo thành công cho người dùng.
   */
  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);

      await addItemToCart(Number(productId), Number(quantity));

      setSuccessMessage("Đã thêm sản phẩm vào giỏ hàng.");
    } catch (error) {
      console.error("Add to cart error:", error);

      notify.error(
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

  /**
   * Chuẩn hóa đường dẫn ảnh sản phẩm để hiển thị trên giao diện.
   *
   * Hàm hỗ trợ nhiều dạng đường dẫn ảnh:
   * - Ảnh rỗng thì dùng ảnh mặc định.
   * - Ảnh đã là URL đầy đủ thì giữ nguyên.
   * - Ảnh bắt đầu bằng /uploads/ hoặc uploads/ thì ghép với domain backend.
   * - Ảnh chỉ có tên file thì ghép vào thư mục uploads/products.
   *
   * @param {string} imagePath Đường dẫn ảnh sản phẩm nhận từ backend.
   * @returns {string} Đường dẫn ảnh có thể dùng trực tiếp trong thẻ img.
   */
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

  <ScrollTopButton />

  return (
    <div className="product-detail">
      {/* Khu vực chính hiển thị ảnh và thông tin chi tiết sản phẩm */}
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

          <p className="product-detail__note">
            Chỉ thêm tối đa 99 sản phẩm vào giỏ hàng!
          </p>

          {/* Khu vực chọn số lượng và thêm sản phẩm vào giỏ hàng */}
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

      {/* Khu vực đánh giá sản phẩm */}
      <div className="product-detail__reviews">
        <ProductReviews productId={productId} />
      </div>

      {/* Nút cuộn nhanh về đầu trang */}
      <ScrollTopButton />
    </div>
    
  );
}

export default ProductDetailPage;