package com.cosmetics.ecommerce.service;

import org.springframework.data.domain.Page;

import com.cosmetics.ecommerce.dto.OrderDetailResponseDTO;
import com.cosmetics.ecommerce.dto.OrderListDTO;
import com.cosmetics.ecommerce.dto.OrderRequestDTO;
import com.cosmetics.ecommerce.dto.OrderResponseDTO;
import com.cosmetics.ecommerce.dto.OrderStatusUpdateResponseDTO;
import com.cosmetics.ecommerce.dto.UpdateOrderStatusRequestDTO;

/**
 * Interface định nghĩa các nghiệp vụ liên quan đến đơn hàng.
 *
 * Bao gồm:
 * - Đặt hàng (checkout)
 * - Xem danh sách đơn hàng của khách hàng
 * - Admin xem danh sách đơn hàng
 * - Admin xem chi tiết đơn hàng
 * - Admin cập nhật trạng thái đơn hàng
 *
 * Ý nghĩa:
 * - Tách biệt tầng Service và Controller
 * - Giúp dễ mở rộng và test (có thể mock khi viết unit test)
 */
public interface OrderService {
    /**
     * Thực hiện chức năng đặt hàng cho người dùng.
     *
     * @param userId  ID của người dùng
     * @param request Thông tin đặt hàng (địa chỉ, phương thức thanh toán)
     * @return Thông tin đơn hàng sau khi đặt thành công
     */
    OrderResponseDTO placeOrder(Integer userId, OrderRequestDTO request);

    /**
     * Lấy danh sách đơn hàng của người dùng.
     *
     * @param userId  ID người dùng
     * @param status  Trạng thái đơn hàng cần lọc, có thể null
     * @param keyword Từ khóa tìm kiếm, có thể null
     * @param page    Số trang cần lấy
     * @param size    Số lượng đơn hàng trên mỗi trang
     * @param sortBy  Trường dùng để sắp xếp
     * @param sortDir Chiều sắp xếp
     * @return Danh sách đơn hàng của người dùng theo dạng phân trang
     */
    Page<OrderResponseDTO> getMyOrders(
        Integer userId,
        String status,
        String keyword,
        int page,
        int size,
        String sortBy,
        String sortDir
    );

    /**
     * Lấy danh sách đơn hàng dành cho Admin.
     *
     * @param status        Trạng thái đơn hàng cần lọc, có thể null
     * @param keyword       Từ khóa tìm kiếm, có thể null
     * @param paymentMethod Phương thức thanh toán cần lọc, có thể null
     * @param paymentStatus Trạng thái thanh toán cần lọc, có thể null
     * @param page          Số trang cần lấy
     * @param size          Số lượng đơn hàng trên mỗi trang
     * @param sortBy        Trường dùng để sắp xếp
     * @param sortDir       Chiều sắp xếp
     * @return Danh sách đơn hàng dành cho Admin theo dạng phân trang
     */
    Page<OrderListDTO> getAdminOrders(
        String status, 
        String keyword,
        String paymentMethod,
        String paymentStatus, 
        int page, 
        int size,
        String sortBy,
        String sortDir
    );

    /**
     * Lấy thông tin chi tiết của một đơn hàng (dành cho Admin).
     *
     * @param orderId ID của đơn hàng
     * @return Thông tin chi tiết đơn hàng
     */
    OrderDetailResponseDTO getOrderDetailForAdmin(Integer orderId);

    /**
     * Cập nhật trạng thái của đơn hàng (dành cho Admin).
     *
     * @param orderId ID của đơn hàng
     * @param request Trạng thái mới cần cập nhật
     * @return Thông tin kết quả cập nhật trạng thái
     */
    OrderStatusUpdateResponseDTO updateOrderStatus(Integer orderId, UpdateOrderStatusRequestDTO request);

    /**
     * Lấy chi tiết đơn hàng của người dùng.
     *
     * @param userId  ID người dùng
     * @param orderId ID đơn hàng
     * @return Thông tin chi tiết đơn hàng
     */
    OrderDetailResponseDTO getOrderDetailForCustomer(Integer userId, Integer orderId);

    /**
     * Xác nhận thanh toán thành công cho đơn hàng COD.
     *
     * @param orderId ID đơn hàng COD cần xác nhận thanh toán
     */
    void confirmCodPayment(Integer orderId);
}
