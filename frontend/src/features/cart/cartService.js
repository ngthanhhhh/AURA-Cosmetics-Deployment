import { cartApi } from "./cartApi";

/**
 * cartService chứa các hàm nghiệp vụ phía frontend liên quan đến giỏ hàng.
 *
 * File này gọi cartApi để gửi request đến backend,
 * sau đó lấy phần response.data trả về cho Context/component sử dụng.
 */
export const cartService = {
    /**
     * Lấy dữ liệu giỏ hàng hiện tại.
     *
     * @returns Dữ liệu giỏ hàng từ backend
     */
    async getCart() {
        //response là toàn bộ phản hồi từ axios
        const response = await cartApi.getCart();
        return response.data;
    },

    /**
     * Thêm sản phẩm vào giỏ hàng.
     *
     * @param productId ID của sản phẩm cần thêm
     * @param quantity Số lượng cần thêm, mặc định là 1
     * @returns Dữ liệu giỏ hàng sau khi thêm sản phẩm
     */
    async addToCart(productId, quantity = 1) {
        const response = await cartApi.addToCart({ //Gọi API thêm vào giỏ và gửi body lên backend.
            productId,
            quantity
        });

        return response.data;
    },

    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng.
     *
     * @param productId ID của sản phẩm cần cập nhật
     * @param quantity Số lượng mới của sản phẩm
     * @returns Dữ liệu giỏ hàng sau khi cập nhật
     */
    async updateCartItem(productId, quantity) {
        const response = await cartApi.updateCartItem({
            productId,
            quantity
        });

        return response.data;
    },

    /**
     * Xóa một sản phẩm khỏi giỏ hàng.
     *
     * @param productId ID của sản phẩm cần xóa
     * @returns Kết quả trả về từ backend sau khi xóa
     */
    async removeCartItem(productId) {
        const response = await cartApi.removeCartItem(productId);
        return response.data;
    }
};