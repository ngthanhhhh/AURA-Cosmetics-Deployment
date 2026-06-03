import { createContext, useCallback, useEffect, useState } from "react";
import { cartService } from "../features/cart/cartService";

// Context dùng để chia sẻ dữ liệu và thao tác giỏ hàng cho toàn bộ app.
export const CartContext = createContext();

export function CartProvider({ children }) {
    // State lưu thông tin giỏ hàng hiện tại
    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [totalCartValue, setTotalCartValue] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    // State phục vụ hiển thị loading/error khi xử lý giỏ hàng
    const [loadingCart, setLoadingCart] = useState(false);
    const [cartError, setCartError] = useState("");

    // Đồng bộ dữ liệu giỏ hàng trả về từ API vào các state trong Context.
    const applyCartData = useCallback((cartData) => {
        const items = cartData?.items || [];

        setCart(cartData || null);
        setCartItems(items);
        setTotalCartValue(cartData?.totalCartValue || 0);

        // Tính tổng số lượng sản phẩm trong giỏ hàng.
        const itemCount = items.reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0
        );

        setTotalItems(itemCount);
    }, []); //function này chỉ được tạo một lần, không tạo lại sau mỗi lần render.

    // Kiểm tra người dùng hiện tại có phải khách hàng hay không.
    const isCustomer = () => {
        //Lấy chuỗi "user" từ localStorage, rồi đổi từ JSON string thành object JavaScript.
        const user = JSON.parse(localStorage.getItem("user") || "null");
        const role = localStorage.getItem("role") || user?.role;

        return role === "ROLE_CUSTOMER";
    }

    // Lấy giỏ hàng hiện tại từ API nếu người dùng đã đăng nhập bằng tài khoản khách hàng.
    const fetchCart = useCallback(async () => { //có async vì bên trong có gọi API bằng await.

        const token = localStorage.getItem("token");

        // Chưa đăng nhập hoặc không phải CUSTOMER thì không gọi API giỏ hàng.
        if (!token || !isCustomer()) {
            applyCartData(null);
            setCartError("");
            return;
        }

        try {
            //Bắt đầu gọi API nên bật loading và xóa lỗi cũ.
            setLoadingCart(true);
            setCartError("");

            //gọi API lấy giỏ hàng
            const data  = await cartService.getCart();
            applyCartData(data);
        } catch (error) {
            console.error("Fetch cart error: ", error);

            setCartError(
                error?.response?.data?.message || "Không thể tải giỏ hàng. Vui lòng thử lại sau."
            );

            applyCartData(null);
        } finally {
            //API thành công hay thất bại thì cuối cùng cũng tắt loading.
            setLoadingCart(false);
        }
    }, [applyCartData]); //applyCartData thay đổi thì React tạo lại fetchCart

    // Thêm sản phẩm vào giỏ hàng.
    // không truyền số lượng thì mặc định thêm 1 sản phẩm.
    const addItemToCart = async (productId, quantity = 1) => {

        const token = localStorage.getItem("token");

        if (!token || !isCustomer()) {
            throw new Error("Vui lòng đăng nhập bằng tài khoản khách hàng để thêm sản phẩm vào giỏ.");
        }

        // Gọi API thêm sản phẩm vào giỏ.
        const data = await cartService.addToCart(productId, quantity);
        applyCartData(data);
    };

    // Cập nhật số lượng của một sản phẩm trong giỏ hàng.
    const updateItemQuantity = async (productId, quantity) => {
        const token = localStorage.getItem("token");

        if (!token || !isCustomer()) {
            throw new Error("Vui lòng đăng nhập bằng tài khoản khách hàng để cập nhật giỏ hàng.");
        }

        const data = await cartService.updateCartItem(productId, quantity);
        applyCartData(data);
    };

    // Xóa một sản phẩm khỏi giỏ hàng.
    const removeItemFromCart = async (productId) => {

        const token = localStorage.getItem("token");

        if (!token || !isCustomer()) {
            throw new Error("Vui lòng đăng nhập bằng tài khoản khách hàng để xóa sản phẩm khỏi giỏ.");
        }

        await cartService.removeCartItem(productId);
        // Sau khi xóa, gọi lại API để đồng bộ giỏ hàng mới nhất.
        await fetchCart();
    };

    // Xóa dữ liệu giỏ hàng khỏi state, thường dùng khi logout hoặc đổi role.
    const clearCartState = useCallback(() => {
        applyCartData(null);
        setCartError("");
    }, [applyCartData]);

    // Tự động tải giỏ hàng khi CartProvider được render.
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