import axiosClient from "../../api/axiosClient";

/**
 * cartApi chứa các hàm gọi API liên quan đến giỏ hàng.
 *
 * File này chỉ chịu trách nhiệm gửi HTTP request đến backend.
 * Logic xử lý dữ liệu sẽ được đặt ở service/context.
 */
export const cartApi = {
    /**
     * Gọi API lấy giỏ hàng hiện tại của người dùng đang đăng nhập.
     * @returns Promise chứa response từ backend
     */
    getCart() {
        return axiosClient.get("/cart");
    },

    /**
     * Gọi API thêm sản phẩm vào giỏ hàng.
     * @param data Dữ liệu gửi lên backend
     * @returns Promise chứa giỏ hàng sau khi thêm sản phẩm
     */
    addToCart(data) {
        return axiosClient.post("/cart/items", data);
    },

    /**
     * Gọi API cập nhật số lượng sản phẩm trong giỏ hàng.
     * @param data Dữ liệu cập nhật
     * @returns Promise chứa giỏ hàng sau khi cập nhật số lượng
     */
    updateCartItem(data) {
        return axiosClient.put("/cart/items", data);
    },

    /**
     * Gọi API xóa một sản phẩm khỏi giỏ hàng.
     * @param productId ID của sản phẩm cần xóa khỏi giỏ hàng
     *
     * @returns Promise chứa kết quả xóa từ backend
     */
    removeCartItem(productId) {
        return axiosClient.delete(`/cart/items/${productId}`);
    }
};