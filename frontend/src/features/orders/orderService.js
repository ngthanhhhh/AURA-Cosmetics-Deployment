import { orderApi } from "./orderApi";

export const orderService = {
    async placeOrder(data) {
        const response = await orderApi.placeOrder(data);
        return response.data;
    },

    async getMyOrders(params) {
        const response = await orderApi.getMyOrders(params);
        return response.data;
    },

    async getMyOrderDetail(orderId) {
        const response = await orderApi.getMyOrderDetail(orderId);
        return response.data;
    },

    async getAdminOrders(params) {
        const response = await orderApi.getAdminOrders(params);
        return response.data;
    },

    async getAdminOrderDetail(orderId) {
        const response = await orderApi.getAdminOrderDetail(orderId);
        return response.data;
    },

    async updateAdminOrderStatus(orderId, status) {
        const response = await orderApi.updateAdminOrderStatus(orderId, status);
        return response.data;
    }
};