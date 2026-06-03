package com.cosmetics.ecommerce.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cosmetics.ecommerce.dto.OrderDetailResponseDTO;
import com.cosmetics.ecommerce.dto.OrderListDTO;
import com.cosmetics.ecommerce.dto.OrderStatusUpdateResponseDTO;
import com.cosmetics.ecommerce.dto.UpdateOrderStatusRequestDTO;
import com.cosmetics.ecommerce.service.OrderService;

import org.springframework.web.bind.annotation.RequestBody;
import lombok.RequiredArgsConstructor;

/**
 * Controller quản lý đơn hàng cho quyền Admin.
 */

@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor //Tự động tạo Constructor để Inject các bean (orderService)
public class AdminOrderController {
    private final OrderService orderService;

    /**
     * Lấy danh sách đơn hàng cho Admin, có phân trang, tìm kiếm, lọc, sắp xếp.
     * * @param status Trạng thái đơn hàng (PENDING,...) - không bắt buộc.
     * @param keyword Từ khóa tìm kiếm (theo tên khách hàng, mã đơn...) - không bắt buộc
     * @param paymentMethod Phương thức thanh toán cần lọc, ví dụ: COD, VNPAY. - không bắt buộc
     * @param paymentStatus Trạng thái thanh toán cần lọc, ví dụ: PENDING, SUCCESS, FAILED. - không bắt buộc
     * @param page Số thứ tự trang muốn lấy (mặc định là 0).
     * @param size Số lượng bản ghi trên mỗi trang (mặc định là 10).
     * @param sortBy Tên trường dùng để sắp xếp, mặc định là createdAt.
     * @param sortDir Chiều sắp xếp, gồm asc hoặc desc, mặc định là desc.
     * @return ResponseEntity chứa đối tượng Page các đơn hàng sau khi thao tác.
     */
    @GetMapping
    public ResponseEntity<Page<OrderListDTO>> getOrders(
        @RequestParam(required = false)  String status,
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String paymentMethod,
        @RequestParam(required = false) String paymentStatus,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir
    ) {
        //Gọi xuống tầng Service để xử lý logic lấy dữ liệu từ Database
        Page<OrderListDTO> result = orderService.getAdminOrders(
            status, 
            keyword, 
            paymentMethod,
            paymentStatus,
            page, 
            size,
            sortBy,
            sortDir
        );
        return ResponseEntity.ok(result);
    }

    /**
     * Lấy thông tin chi tiết của 1 đơn hàng cụ thể theo ID
     * * @param id ID của đơn hàng cần xem chi tiết
     * @return ResponseEntity chứa thông tin chi tiết đầy đủ của đơn hàng
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailResponseDTO> getOrderDetail(@PathVariable Integer id){
        // Gọi Service để lấy chi tiết đơn hàng dành cho Admin
        return ResponseEntity.ok(orderService.getOrderDetailForAdmin(id));
    }

    /**
     * Cập nhật trạng thái đơn hàng.
     *
     * API cho phép Admin thay đổi trạng thái của một đơn hàng cụ thể.
     * Backend sẽ:
     * - Kiểm tra tính hợp lệ của trạng thái mới
     * - Kiểm tra luồng chuyển trạng thái (không cho quay ngược)
     * - Kiểm tra thanh toán nếu chuyển sang COMPLETED
     * - Hoàn kho nếu chuyển sang CANCELLED
     *
     * @param id      ID của đơn hàng cần cập nhật
     * @param request Dữ liệu chứa trạng thái mới (status)
     * @return Thông tin trạng thái trước và sau khi cập nhật
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderStatusUpdateResponseDTO> updateOrderStatus(
            @PathVariable Integer id,
            @RequestBody UpdateOrderStatusRequestDTO request
    ) {
        OrderStatusUpdateResponseDTO result = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(result);
    }

    /**
     * Xác nhận thanh toán COD thành công cho một đơn hàng.
     *
     * API này dùng cho trường hợp khách hàng chọn thanh toán khi nhận hàng.
     * Sau khi Admin xác nhận đã thu tiền COD, hệ thống sẽ cập nhật trạng thái
     * thanh toán của đơn hàng sang thành công.
     *
     * @param id ID của đơn hàng cần xác nhận thanh toán COD.
     * @return ResponseEntity chứa thông báo xác nhận thanh toán COD thành công.
     */
    @PutMapping("/{id}/cod-payment-success")
    public ResponseEntity<String> confirmCodPayment(
        @PathVariable Integer id
    ) {
        orderService.confirmCodPayment(id);
        
        return ResponseEntity.ok("Xác nhận thanh toán COD thành công!");
    }
}
