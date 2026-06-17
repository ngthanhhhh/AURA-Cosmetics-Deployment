import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import { useEffect, useContext, useState} from "react";
import "./CartPage.css";

import { confirmDelete } from "../../utils/confirm";
/**
 * Trang giỏ hàng của khách hàng.
 *
 * Component này lấy dữ liệu giỏ hàng từ CartContext,
 * hiển thị danh sách sản phẩm trong giỏ,
 * cho phép tăng/giảm số lượng, xóa sản phẩm
 * và chuyển sang trang checkout.
 */
function CartPage() {
    // Hook dùng để điều hướng sang trang khác bằng code.
    const navigate = useNavigate();

    // Lấy state và các hàm xử lý giỏ hàng từ CartContext.
    const {
        cartItems,
        totalCartValue,
        totalItems,
        loadingCart,
        cartError,
        fetchCart,
        updateItemQuantity,
        removeItemFromCart
    } = useContext(CartContext);

    // Lưu productId của sản phẩm đang được cập nhật/xóa
    // để disable nút tương ứng trong lúc gọi API.
    const [updatingProductId, setUpdatingProductId] = useState(null);

    // Lưu lỗi phát sinh riêng trong trang CartPage.
    const [pageError, setPageError] = useState("");

    // Khi trang giỏ hàng được render, tự động tải lại dữ liệu giỏ hàng.
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    /**
     * Giảm số lượng sản phẩm đi 1.
     *
     * Nếu số lượng mới <= 0 thì chuyển sang xử lý xóa sản phẩm khỏi giỏ.
     *
     * @param item Sản phẩm trong giỏ hàng
     */
    const handleDecrease = async (item) => {
        const newQuantity = Number(item.quantity) - 1;

        if (newQuantity <= 0) {
            await handleRemove(item);
            return;
        }

        await handleUpdateQuantity(item.productId, newQuantity);
    };

    /**
     * Tăng số lượng sản phẩm lên 1.
     *
     * @param item Sản phẩm trong giỏ hàng
     */
    const handleIncrease = async (item) => {
        const newQuantity = Number(item.quantity) + 1;
        await handleUpdateQuantity(item.productId, newQuantity);
    };

    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng.
     *
     * Method này gọi hàm updateItemQuantity từ CartContext.
     * Nếu cập nhật thành công, Context sẽ tự đồng bộ lại dữ liệu giỏ hàng.
     *
     * @param productId ID sản phẩm cần cập nhật
     * @param quantity Số lượng mới
     */
    const handleUpdateQuantity = async (productId, quantity) => {
        try {
            setPageError("");
            setUpdatingProductId(productId);

            await updateItemQuantity(productId, quantity);
        } catch (error) {
            console.error("Update cart item error: ", error);

            setPageError(
                error?.response?.data?.message ||
                "Không thể cập nhật số lượng sản phẩm."
            );
        } finally {
            setUpdatingProductId(null);
        }
    };

    /**
     * Xóa sản phẩm khỏi giỏ hàng.
     *
     * Trước khi xóa, hệ thống hiển thị hộp thoại xác nhận.
     *
     * @param item Sản phẩm cần xóa khỏi giỏ hàng
     */
    const handleRemove = async (item) => {
        const isConfirmed = await confirmDelete(
            "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?",
            "Sản phẩm sẽ được xóa khỏi giỏ hàng của bạn."
        );

        if (!isConfirmed) return;

        try {
            setPageError("");
            setUpdatingProductId(item.productId);

            await removeItemFromCart(item.productId); //Gọi hàm xóa sản phẩm từ CartContext.
        } catch (error) {
            console.error("Remove cart item error: ", error);

            setPageError(
                error?.response?.data?.message || 
                "Không thể xóa sản phẩm khỏi giỏ hàng."
            );
        } finally {
            setUpdatingProductId(null);
        }
    };

    // Nếu đang tải giỏ hàng thì hiển thị trạng thái loading.
    if (loadingCart) {
        return (
            <div className="cart-page">
                <h2>Giỏ hàng</h2>
                <p>Đang tải giỏ hàng...</p>
            </div>
        );
    }

    return (
        <div className="cart-page">
        <div className="cart-page__header">
            <h2>Giỏ hàng của tôi</h2>
            <Link to="/products" className="cart-page__continue-link">
                Tiếp tục mua sắm
            </Link>
        </div>

        {/* Hiển thị lỗi từ Context hoặc lỗi riêng của trang */}
        {(cartError || pageError) && (
            <div className="cart-page__error">{cartError || pageError}</div>
        )}

        {!cartItems || cartItems.length === 0 ? (
            <div className="cart-page__empty">
                <p>Giỏ hàng của bạn đang trống.</p>
                <Link to="/products">Tiếp tục mua sắm</Link>
            </div>
        ) : (
            <>
            {/* Bảng danh sách sản phẩm trong giỏ hàng */}
            <div className="cart-page__table-wrapper">
                <table className="cart-page__table">
                <thead>
                    <tr>
                    <th>Sản phẩm</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {cartItems.map((item) => {
                        {/*Kiểm tra sản phẩm hiện tại có đang cập nhật/xóa hay không.*/}
                        const isUpdating = updatingProductId === item.productId;

                        return (
                            <tr key={item.cartItemId || item.productId}>
                            <td>
                                <div className="cart-page__product">
                                    {item.productImage && (
                                        <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="cart-page__product-image"
                                        />
                                    )}

                                    <div>
                                        <div className="cart-page__product-name">
                                            {item.productName}
                                        </div>
                                        <Link
                                            to={`/products/${item.productId}`}
                                            className="cart-page__product-link"
                                        >
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </div>
                            </td>

                            <td>{formatCurrency(item.unitPrice)}</td>

                            <td>
                                <div className="cart-page__quantity">
                                    <button
                                        type="button"
                                        onClick={() => handleDecrease(item)}
                                        disabled={isUpdating}
                                        className="cart-page__quantity-btn"
                                    >
                                        -
                                    </button>

                                    <span>{item.quantity}</span>

                                    <button
                                        type="button"
                                        onClick={() => handleIncrease(item)}
                                        disabled={isUpdating}
                                        className="cart-page__quantity-btn"
                                    >
                                        +
                                    </button>
                                </div>
                            </td>

                            <td className="cart-page__item-total">
                                {formatCurrency(item.totalPrice)}
                            </td>

                            <td>
                                <button
                                    type="button"
                                    onClick={() => handleRemove(item)}
                                    disabled={isUpdating}
                                    className="cart-page__delete-btn"
                                >
                                Xóa
                                </button>
                            </td>
                            </tr>
                        );
                    })}
                </tbody>
                </table>
            </div>

            <div className="cart-page__summary">
                <div>
                <p>
                    Tổng số sản phẩm: <strong>{totalItems}</strong>
                </p>
                <p>
                    Tổng giá trị:{" "}
                    <strong>{formatCurrency(totalCartValue)}</strong>
                </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/checkout")}
                    className="cart-page__checkout-btn"
                >
                Tiến hành đặt hàng
                </button>
            </div>
            </>
        )}
        </div>
    );
}

export default CartPage;