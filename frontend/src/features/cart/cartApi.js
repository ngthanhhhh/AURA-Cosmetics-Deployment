import axiosClient from "../../api/axiosClient";

export const cartApi = {
    getCart() {
        return axiosClient.get("/cart");
    },

    addToCart(data) {
        return axiosClient.post("/cart/items", data);
    },

    updateCartItem(data) {
        return axiosClient.put("/cart/items", data);
    },

    removeCartItem(productId) {
        return axiosClient.delete(`/cart/items/${productId}`);
    }
};