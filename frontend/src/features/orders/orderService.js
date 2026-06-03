import { orderApi } from "./orderApi";

/**
 * orderService chứa các hàm nghiệp vụ phía frontend liên quan đến đơn hàng.
 *
 * File này gọi orderApi để gửi request đến backend,
 * sau đó lấy response.data trả về cho component sử dụng.
 *
 * Khác với orderApi:
 * - orderApi: chỉ gọi HTTP request
 * - orderService: lấy dữ liệu cần dùng từ response
 */
export const orderService = {
    /**
     * Gửi yêu cầu đặt hàng.
     *
     * @param data Dữ liệu đặt hàng
     * @returns Dữ liệu đơn hàng vừa được tạo
     */
    async placeOrder(data) {
        const response = await orderApi.placeOrder(data); // Gọi API đặt hàng.
        return response.data; // Trả về phần data từ response để component dùng trực tiếp.
    },

    /**
     * Lấy danh sách đơn hàng của khách hàng đang đăng nhập.
     *
     * @param params Tham số tìm kiếm, lọc, sắp xếp và phân trang
     *
     * @returns Danh sách đơn hàng của khách hàng
     */
    async getMyOrders(params) {
        const response = await orderApi.getMyOrders(params); // Gọi API lấy danh sách đơn hàng của khách.
        return response.data; // Trả về dữ liệu backend gửi về.
    },

    /**
     * Lấy chi tiết một đơn hàng của khách hàng đang đăng nhập.
     *
     * @param orderId ID của đơn hàng cần xem chi tiết
     *
     * @returns Chi tiết đơn hàng
     */
    async getMyOrderDetail(orderId) {
        const response = await orderApi.getMyOrderDetail(orderId); // Gọi API lấy chi tiết đơn hàng phía khách hàng.
        return response.data; // Trả về dữ liệu chi tiết đơn hàng.
    },

    /**
     * Lấy danh sách đơn hàng phía Admin.
     *
     * @param params Tham số tìm kiếm, lọc, sắp xếp và phân trang
     * @returns Danh sách đơn hàng cho Admin
     */
    async getAdminOrders(params) {
        const response = await orderApi.getAdminOrders(params); // Gọi API lấy danh sách đơn hàng phía Admin.
        return response.data; // Trả về dữ liệu danh sách đơn hàng.
    },

    /**
     * Lấy chi tiết một đơn hàng phía Admin.
     *
     * @param orderId ID của đơn hàng cần xem chi tiết
     * @returns Chi tiết đơn hàng cho Admin
     */
    async getAdminOrderDetail(orderId) {
        const response = await orderApi.getAdminOrderDetail(orderId); // Gọi API lấy chi tiết đơn hàng phía Admin.
        return response.data; // Trả về dữ liệu chi tiết đơn hàng.
    },

    /**
     * Cập nhật trạng thái đơn hàng phía Admin.
     *
     * @param orderId ID của đơn hàng cần cập nhật
     * @param status Trạng thái mới của đơn hàng
     * @returns Kết quả cập nhật trạng thái
     */
    async updateAdminOrderStatus(orderId, status) {
        const response = await orderApi.updateAdminOrderStatus(orderId, status);
        return response.data;
    },

    /**
     * Xác nhận thanh toán thành công cho đơn COD.
     *
     * @param orderId ID của đơn hàng COD cần xác nhận thanh toán
     * @returns Kết quả xác nhận thanh toán COD
     */
    async confirmCodPayment(orderId) {
        const response = await orderApi.confirmCodPayment(orderId);
        return response.data;
    }
};