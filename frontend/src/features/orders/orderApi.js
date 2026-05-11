import axiosClient from "../../api/axiosClient";

export const orderApi = {
    placeOrder(data) {
        return axiosClient.post("/orders", data);
    },

    getMyOrders(params) {
        return axiosClient.get("/orders/my-orders", {params});
    },

    getMyOrderDetail(orderId) {
        return axiosClient.get(`/orders/${orderId}`);
    },

    getAdminOrders(params) {
        return axiosClient.get("/admin/orders", {params});
    },

    getAdminOrderDetail(orderId) {
        return axiosClient.get(`/admin/orders/${orderId}`);
    },

    updateAdminOrderStatus(orderId, status) {
        return axiosClient.put(`/admin/orders/${orderId}/status`, {
            status
        });
    }
};