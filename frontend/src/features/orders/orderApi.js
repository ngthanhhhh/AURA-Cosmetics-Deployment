import axiosClient from "../../api/axiosClient";

/**
 * orderApi chứa các hàm gọi API liên quan đến đơn hàng.
 *
 * File này chỉ chịu trách nhiệm gửi HTTP request đến backend.
 * Logic xử lý dữ liệu sẽ nằm ở orderService hoặc component sử dụng.
 */
export const orderApi = {
    /**
     * Gọi API đặt hàng cho khách hàng.
     * 
     * @param data Dữ liệu đặt hàng
     * @returns Promise chứa thông tin đơn hàng vừa tạo
     */
    placeOrder(data) {
        return axiosClient.post("/orders", data);
    },

    /**
     * Gọi API lấy danh sách đơn hàng của khách hàng đang đăng nhập.
     * 
     * @param params Tham số tìm kiếm, lọc, sắp xếp và phân trang
     * @returns Promise chứa danh sách đơn hàng của khách hàng
     */
    getMyOrders(params) {
        return axiosClient.get("/orders/my-orders", {params});
    },

    /**
     * Gọi API lấy chi tiết một đơn hàng của khách hàng đang đăng nhập.
     *
     * @param orderId ID của đơn hàng cần xem chi tiết
     * @returns Promise chứa chi tiết đơn hàng
     */
    getMyOrderDetail(orderId) {
        return axiosClient.get(`/orders/${orderId}`);
    },

    /**
     * Gọi API lấy danh sách đơn hàng phía Admin.
     *
     * @param params Tham số tìm kiếm, lọc, sắp xếp và phân trang
     * @returns Promise chứa danh sách đơn hàng cho Admin
     */
    getAdminOrders(params) {
        return axiosClient.get("/admin/orders", {params});
    },

    /**
     * Gọi API lấy chi tiết một đơn hàng phía Admin.
     *
     * @param orderId ID của đơn hàng cần xem chi tiết
     * @returns Promise chứa chi tiết đơn hàng cho Admin
     */
    getAdminOrderDetail(orderId) {
        return axiosClient.get(`/admin/orders/${orderId}`);
    },

    /**
     * Gọi API cập nhật trạng thái đơn hàng phía Admin.
     * 
     * @param orderId ID của đơn hàng cần cập nhật
     * @param status Trạng thái mới của đơn hàng
     * @returns Promise chứa kết quả cập nhật trạng thái
     */
    updateAdminOrderStatus(orderId, status) {
        return axiosClient.put(`/admin/orders/${orderId}/status`, {
            status
        });
    },

    /**
     * Gọi API xác nhận thanh toán thành công cho đơn COD.
     *
     * @param orderId ID của đơn hàng COD cần xác nhận thanh toán
     * @returns Promise chứa kết quả xác nhận thanh toán COD
     */
    confirmCodPayment(orderId) {
        return axiosClient.put(
            `/admin/orders/${orderId}/cod-payment-success`
        );
    }
};