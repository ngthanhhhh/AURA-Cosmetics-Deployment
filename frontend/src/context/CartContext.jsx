import { createContext, useCallback, useEffect, useState } from "react";
import { cartService } from "../features/cart/cartService";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [totalCartValue, setTotalCartValue] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const [loadingCart, setLoadingCart] = useState(false);
    const [cartError, setCartError] = useState("");

    const applyCartData = useCallback((cartData) => {
        const items = cartData?.items || [];

        setCart(cartData || null);
        setCartItems(items);
        setTotalCartValue(cartData?.totalCartValue || 0);

        const itemCount = items.reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0
        );

        setTotalItems(itemCount);
    }, []);

    const isCustomer = () => {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        const role = localStorage.getItem("role") || user?.role;

        return role === "ROLE_CUSTOMER";
    }

    const fetchCart = useCallback(async () => {

        const token = localStorage.getItem("token");

        // Chưa login hoặc không phải CUSTOMER thì không gọi /cart
        if (!token || !isCustomer()) {
            applyCartData(null);
            setCartError("");
            return;
        }

        try {
            setLoadingCart(true);
            setCartError("");

            const data  = await cartService.getCart();
            applyCartData(data);
        } catch (error) {
            console.error("Fetch cart error: ", error);

            setCartError(
                error?.response?.data?.message || "Không thể tải giỏ hàng. Vui lòng thử lại sau."
            );

            applyCartData(null);
        } finally {
            setLoadingCart(false);
        }
    }, [applyCartData]);

    const addItemToCart = async (productId, quantity = 1) => {

        const token = localStorage.getItem("token");

        if (!token || !isCustomer()) {
            throw new Error("Vui lòng đăng nhập bằng tài khoản khách hàng để thêm sản phẩm vào giỏ.");
        }

        const data = await cartService.addItemToCart(productId, quantity);
        applyCartData(data);
    };

    const updateItemQuantity = async (productId, quantity) => {
        const token = localStorage.getItem("token");

        if (!token || !isCustomer()) {
            throw new Error("Vui lòng đăng nhập bằng tài khoản khách hàng để cập nhật giỏ hàng.");
        }

        const data = await cartService.updateCartItem(productId, quantity);
        applyCartData(data);
    };

    const removeItemFromCart = async (productId) => {

        const token = localStorage.getItem("token");

        if (!token || !isCustomer()) {
            throw new Error("Vui lòng đăng nhập bằng tài khoản khách hàng để xóa sản phẩm khỏi giỏ.");
        }

        await cartService.removeCartItem(productId);
        await fetchCart();
    };

    const clearCartState = useCallback(() => {
        applyCartData(null);
        setCartError("");
    }, [applyCartData]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    return (
        <CartContext.Provider 
            value={{ 
                cart, 
                cartItems,
                totalCartValue,
                totalItems,
                loadingCart,
                cartError,
                fetchCart,
                addItemToCart,
                updateItemQuantity,
                removeItemFromCart,
                clearCartState 
            }}
        >
            {children}
        </CartContext.Provider>
    );
}