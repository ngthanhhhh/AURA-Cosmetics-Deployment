package com.cosmetics.ecommerce.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cosmetics.ecommerce.dto.OrderDetailResponseDTO;
import com.cosmetics.ecommerce.dto.OrderRequestDTO;
import com.cosmetics.ecommerce.dto.OrderResponseDTO;
import com.cosmetics.ecommerce.security.CurrentUserProvider;
import com.cosmetics.ecommerce.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controller quản lý đơn hàng của khách hàng.
 *
 * Controller này nhận các request liên quan đến đơn hàng của người dùng hiện tại,
 * lấy userId từ Authentication, sau đó gọi xuống OrderService để xử lý nghiệp vụ.
 */
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final CurrentUserProvider currentUserProvider;

    /**
     * Tạo đơn hàng mới cho khách hàng hiện tại.
     *
     * API này dùng khi khách hàng đặt hàng từ giỏ hàng.
     * Hệ thống sẽ lấy userId từ thông tin đăng nhập,
     * sau đó gửi dữ liệu đặt hàng xuống Service để xử lý.
     *
     * @param authentication Thông tin xác thực của người dùng hiện tại.
     * @param request        Dữ liệu đặt hàng, gồm thông tin người nhận,
     *                       địa chỉ giao hàng và phương thức thanh toán.
     * @return ResponseEntity chứa thông tin đơn hàng vừa được tạo.
     */
    @PostMapping
    public ResponseEntity<OrderResponseDTO> placeOrder(
        Authentication authentication,
        @Valid @RequestBody OrderRequestDTO request) 
    {
        Integer currentUserId = currentUserProvider.getCurrentUserId(authentication);
        OrderResponseDTO response = orderService.placeOrder(currentUserId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách đơn hàng của khách hàng hiện tại.
     *
     * API này hỗ trợ lọc theo trạng thái, tìm kiếm, phân trang và sắp xếp.
     *
     * @param authentication Thông tin xác thực của người dùng hiện tại.
     * @param status         Trạng thái đơn hàng cần lọc, ví dụ: PENDING,
     *                       PREPARING, SHIPPING, DELIVERED, COMPLETED, CANCELLED.
     *                       Không bắt buộc.
     * @param keyword        Từ khóa tìm kiếm theo thông tin đơn hàng.
     *                       Không bắt buộc.
     * @param page           Số thứ tự trang muốn lấy, mặc định là 0.
     * @param size           Số lượng bản ghi trên mỗi trang, mặc định là 10.
     * @param sortBy         Tên trường dùng để sắp xếp, mặc định là createdAt.
     * @param sortDir        Chiều sắp xếp, gồm asc hoặc desc, mặc định là desc.
     * @return ResponseEntity chứa Page danh sách đơn hàng của người dùng.
     */
    @GetMapping("/my-orders")
    public ResponseEntity<Page<OrderResponseDTO>> getMyOrders(
        Authentication authentication,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String keyword,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Integer currentUserId = currentUserProvider.getCurrentUserId(authentication);
        Page<OrderResponseDTO> history = orderService.getMyOrders(
            currentUserId,
            status,
            keyword,
            page,
            size,
            sortBy,
            sortDir
        );
        return ResponseEntity.ok(history);
        
    }

    /**
     * Lấy thông tin chi tiết của một đơn hàng thuộc về khách hàng hiện tại.
     *
     * API này lấy id đơn hàng từ URL và userId từ Authentication.
     * Service sẽ kiểm tra đơn hàng có thuộc về người dùng hiện tại hay không
     * trước khi trả về dữ liệu chi tiết.
     *
     * @param authentication Thông tin xác thực của người dùng hiện tại.
     * @param id             ID của đơn hàng cần xem chi tiết.
     * @return ResponseEntity chứa thông tin chi tiết của đơn hàng.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailResponseDTO> getMyOrderDetail(
        Authentication authentication,
        @PathVariable Integer id) 
    {
        Integer currentUserId = currentUserProvider.getCurrentUserId(authentication);
        OrderDetailResponseDTO detail = orderService.getOrderDetailForCustomer(currentUserId, id);
        return ResponseEntity.ok(detail);
    }
}
