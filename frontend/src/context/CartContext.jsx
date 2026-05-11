import { createContext, useCallback, useEffect, useState } from "react";
import { cartService } from "../features/cart/cartService";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [totalCartValue, setTotalCartValue] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const [loadingCart, setLoadingCart] = useState(false);
    const [cartError, setCartError] = useState("");

    const applyCartData = (cartData) => {
        const items = cartData?.items || [];

        setCart(cartData || null);
        setCartItems(items);
        setTotalCartValue(cartData?.totalCartValue || 0);

        const itemCount = items.reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0
        );

        setTotalItems(itemCount);
    };

    const fetchCart = useCallback(async () => {
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
    }, []);

    const addItemToCart = async (productId, quantity = 1) => {
        const data = await cartService.addItemToCart(productId, quantity);
        applyCartData(data);
    };

    const updateItemQuantity = async (productId, quantity) => {
        const data = await cartService.updateCartItem(productId, quantity);
        applyCartData(data);
    };

    const removeItemFromCart = async (productId) => {
        await cartService.removeCartItem(productId);
        await fetchCart();
    };

    const clearCartState = () => {
        applyCartData(null);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            fetchCart();
        }
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