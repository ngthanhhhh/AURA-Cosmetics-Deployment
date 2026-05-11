import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { orderService } from "../../features/orders/orderService";
import { paymentService } from "../../features/payments/paymentService";
import { formatCurrency } from "../../utils/formatCurrency";

import "./CheckoutPage.css";

function CheckoutPage() {
    const navigate = useNavigate();

    const {
        cartItems,
        totalCartValue,
        loadingCart,
        cartError,
        fetchCart,
        clearCartState
    } = useContext(CartContext);

    const [formData, setFormData] = useState({
        recipientName: "",
        recipientPhone: "",
        shippingAddress: "",
        paymentMethod: "COD"
    });

    const [submitting, setSubmitting] = useState(false);
    const [pageError, setPageError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleChange = (event) => {
        const {name, value} = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.recipientName.trim()) {
            return "Họ tên người nhận không được để trống!";
        }

        if (!/^\d{10}$/.test(formData.recipientPhone.trim())) {
            return "Số điện thoại phải gồm đúng 10 chữ số!";
        }

        if (!formData.shippingAddress.trim()) {
            return "Địa chỉ giao hàng không được để trống!";
        }

        if (!formData.paymentMethod) {
            return "Vui lòng chọn phương thức thanh toán!";
        }

        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setPageError("");
        setSuccessMessage("");

        if (!cartItems || cartItems.length === 0) {
            setPageError("Giỏ hàng đang trống. Vui lòng thêm sản phẩm trước khi đặt hàng!");
            return;
        }

        const validationError = validateForm();

        if (validationError) {
            setPageError(validationError);
            return;
        }

        try {
            setSubmitting(true);

            const order = await orderService.placeOrder({
                recipientName: formData.recipientName.trim(),
                recipientPhone: formData.recipientPhone.trim(),
                shippingAddress: formData.shippingAddress.trim(),
                paymentMethod: formData.paymentMethod
            });

            if (formData.paymentMethod === "VNPAY") {
                const paymentResult = await paymentService.createVnPayPayment(order.orderId);

                if (!paymentResult?.paymentUrl) {
                    throw new Error("Không nhận được đường dẫn thanh toán VNPay.");
                }

                window.location.href = paymentResult.paymentUrl;
                return;
            }

            clearCartState();
            setSuccessMessage(order.message || "Đặt hàng thành công!");
            navigate(`/my-orders/${order.orderId}`);
        } catch (error) {
            console.error("Checkout error: ", error);

            setPageError(
                error?.response?.data?.message || error?.message || "Không thể đặt hàng. Vui lòng thử lại sau!"
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingCart) {
        return (
            <div className="checkout-page">
                <h2>Thanh toán</h2>
                <p>Đang tải giỏ hàng...</p>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-page__header">
                <h2>Thanh toán</h2>
                <Link to="/cart">Quay lại giỏ hàng</Link>
            </div>

            {(cartError || pageError) && (
                <div className="checkout-page__error">{cartError || pageError}</div>
            )}

            {successMessage && (
                <div className="checkout-page__success">{successMessage}</div>
            )}

            {!cartItems || cartItems.length === 0 ? (
                <div className="checkout-page__empty">
                    <p>Giỏ hàng đang trống!</p>
                    <Link to="/products">Tiếp tục mua sắm</Link>
                </div>
            ) : (
                <div className="checkout-page__content">
                    <form className="checkout-page__form" onSubmit={handleSubmit}>
                        <h3>Thông tin nhận hàng</h3>

                        <div className="checkout-page__form-group">
                            <label>Họ tên người nhận</label>
                            <input
                                type = "text"
                                name = "recipientName"
                                value = {formData.recipientName}
                                onChange = {handleChange}
                                placeholder="Nhập họ tên người nhận"
                                required
                            />
                        </div>

                        <div className="checkout-page__form-group">
                            <label>Số điện thoại</label>
                            <input
                                type="tel"
                                name="recipientPhone"
                                value={formData.recipientPhone}
                                onChange={handleChange}
                                placeholder="Nhập số điện thoại 10 chữ số"
                                required
                            />
                        </div>

                        <div className="checkout-page__form-group">
                            <label>Địa chỉ giao hàng</label>
                            <textarea
                                name="shippingAddress"
                                value={formData.shippingAddress}
                                onChange={handleChange}
                                placeholder="Nhập địa chỉ giao hàng"
                                rows="4"
                                required
                            />
                        </div>

                        <div className="checkout-page__form-group">
                            <label>Phương thức thanh toán</label>

                            <div className="checkout-page__payment-options">
                                <label>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={formData.paymentMethod === "COD"}
                                        onChange={handleChange}
                                    />
                                    Thanh toán khi nhận hàng
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="VNPAY"
                                        checked={formData.paymentMethod === "VNPAY"}
                                        onChange={handleChange}
                                    />
                                    Thanh toán qua VNPay
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="checkout-page__submit-btn"
                            disabled={submitting}
                        >{submitting ? "Đang xử lý..." : "Đặt hàng"}</button>
                    </form>

                    <div className="checkout-page__summary">
                        <h3>Tóm tắt đơn hàng</h3>

                        <div className="checkout-page__items">
                            {cartItems.map((item) => (
                                <div
                                    key={item.cartItemId || item.productId}
                                    className="checkout-page__item"
                                >
                                    <div>
                                        <p className="checkout-page__item-name">
                                            {item.productName}
                                        </p>
                                        <span>Số lượng: {item.quantity}</span>
                                    </div>

                                    <strong>{formatCurrency(item.totalPrice)}</strong>
                                </div>
                            ))}
                        </div>

                        <div className="checkout-page__total">
                            <span>Tổng thanh toán</span>
                            <strong>{formatCurrency(totalCartValue)}</strong>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CheckoutPage;