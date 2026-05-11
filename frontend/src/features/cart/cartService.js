import { cartApi } from "./cartApi";

export const cartService = {
    async getCart() {
        const response = await cartApi.getCart();
        return response.data;
    },

    async addToCart(productId, quantity = 1) {
        const response = await cartApi.addToCart({
            productId,
            quantity
        });

        return response.data;
    },

    async updateCartItem(productId, quantity) {
        const response = await cartApi.updateCartItem({
            productId,
            quantity
        });

        return response.data;
    },

    async removeCartItem(productId) {
        const response = await cartApi.removeCartItem(productId);
        return response.data;
    }
};