package com.cosmetics.ecommerce.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.cosmetics.ecommerce.exception.BadRequestException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cosmetics.ecommerce.dto.OrderDetailResponseDTO;
import com.cosmetics.ecommerce.dto.OrderItemDTO;
import com.cosmetics.ecommerce.dto.OrderListDTO;
import com.cosmetics.ecommerce.dto.OrderRequestDTO;
import com.cosmetics.ecommerce.dto.OrderResponseDTO;
import com.cosmetics.ecommerce.entity.*;
import com.cosmetics.ecommerce.enums.OrderStatus;
import com.cosmetics.ecommerce.enums.PaymentMethod;
import com.cosmetics.ecommerce.enums.PaymentStatus;
import com.cosmetics.ecommerce.exception.ResourceNotFoundException;
import com.cosmetics.ecommerce.repository.CartItemRepository;
import com.cosmetics.ecommerce.repository.CartRepository;
import com.cosmetics.ecommerce.repository.OrderItemRepository;
import com.cosmetics.ecommerce.repository.OrderRepository;
import com.cosmetics.ecommerce.repository.PaymentRepository;
import com.cosmetics.ecommerce.repository.ProductRepository;
import com.cosmetics.ecommerce.repository.UserRepository;
import com.cosmetics.ecommerce.service.OrderService;

import lombok.RequiredArgsConstructor;

/**
 * Service triển khai các nghiệp vụ liên quan đến đơn hàng.
 * Bao gồm:
 * - Đặt hàng (checkout)
 * - Xem lịch sử đơn hàng của khách hàng
 * - Admin xem danh sách đơn hàng
 * - Admin xem chi tiết đơn hàng
 */
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService{

    private static final String PRODUCT_DISCONTINUED_NOTE = "Sản phẩm này hiện đã ngừng kinh doanh";
    private static final String NO_PAYMENT_MESSAGE = "Chưa có thông tin thanh toán";

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    /**
     * Thực hiện chức năng đặt hàng cho người dùng.
     *
     * Quy trình xử lý:
     * - Kiểm tra người dùng tồn tại
     * - Lấy giỏ hàng hiện tại
     * - Kiểm tra số lượng tồn kho của từng sản phẩm
     * - Tạo đơn hàng và chi tiết đơn hàng
     * - Tạo thông tin thanh toán
     * - Xóa giỏ hàng sau khi đặt thành công
     *
     * @param userId  ID của người dùng đang đặt hàng
     * @param request Thông tin người nhận và phương thức thanh toán
     * @return Thông tin đơn hàng sau khi đặt thành công
     */
    @Override
    @Transactional
    public OrderResponseDTO placeOrder(Integer userId, OrderRequestDTO request) {

        //1. Kiểm tra sự tồn tại của User
        User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng!"));

        //2. Lấy giỏ hàng của User và kiểm tra tính hợp lệ
        Cart cart = cartRepository.findByUser_UserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng của bạn hiện đang trống!"));

        List<CartItem> cartItems = cart.getCartItems();
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Giỏ hàng của bạn đang trống, không thể đặt hàng!");
        }

        //3. Khởi tạo đối tượng Đơn hàng (Order) với trạng thái mặc định là PENDING
        Order order = new Order();
        order.setUser(user);
        order.setRecipientName(request.getRecipientName());
        order.setRecipientPhone(request.getRecipientPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setStatus(OrderStatus.PENDING);
        order.setTotalPrice(BigDecimal.ZERO); //Tạm thời gán bằng 0, cộng dồn sau

        Order savedOrder = orderRepository.save(order);
        BigDecimal totalAmount = BigDecimal.ZERO;

        //4. Xử lý từng sản phẩm trong giỏ: Kiểm tra kho, trừ kho và tạo chi tiết đơn hàng (OrderItem)
        for (CartItem item : cartItems) {
            //Sử dụng Pessimistic Lock (findByIdWithLock) để khóa row sản phẩm trong csdl.
            //-> Ngăn tình trạng "Race Condition" khi nhiều người cùng mua 1 món hàng cuối cùng lúc.
            Product product = productRepository.findByIdWithLock(item.getProduct().getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại!"));

            //Kiểm tra số lượng tồn kho
            if (product.getStock() < item.getQuantity()){
                throw new BadRequestException("Sản phẩm " + product.getName() + " đã hết hàng hoặc không đủ số lượng trong kho");
            }

            //Trừ số lượng kho thực tế và lưu lại
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);

            //Tạo chi tiết đơn hàng. Note: Lưu cứng tên và giá tại thời điểm mua
            // để tránh bị ảnh hưởng nếu sau này sản phẩm đổi giá hoặc đổi tên.
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setProductName(product.getName());
            orderItem.setPrice(product.getPrice());
            orderItem.setQuantity(item.getQuantity());
            orderItemRepository.save(orderItem);

            //Cộng dồn tổng tiền của đơn hàng (Giá * Số lượng)
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        //5. Cập nhật lại tổng tiền cuối cùng cho đơn hàng
        savedOrder.setTotalPrice(totalAmount);
        orderRepository.save(savedOrder);

        //6. Tạo bản ghi thanh toán tương ứng với đơn hàng
        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setAmount(totalAmount);
        payment.setPaymentMethod(PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase()));
        payment.setStatus(PaymentStatus.PENDING);
        paymentRepository.save(payment);

        //7. Xóa sạch giỏ hàng sau khi đặt hàng thành công
        cartItemRepository.deleteByCartId(cart.getCartId());
        
        //8. Đóng gói dữ liệu trả về cho Client
        return OrderResponseDTO.builder()
                .orderId(savedOrder.getOrderId())
                .status(savedOrder.getStatus().name())
                .totalPrice(savedOrder.getTotalPrice())
                .recipientName(savedOrder.getRecipientName())
                .recipientPhone(savedOrder.getRecipientPhone())
                .shippingAddress(savedOrder.getShippingAddress())
                .createdAt(savedOrder.getCreatedAt())
                .message("Đặt hàng thành công. Mã đơn hàng của bạn là #" + savedOrder.getOrderId())
                .build();
    }

    /**
     * Lấy danh sách các đơn hàng của người dùng hiện tại.
     *
     * @param userId ID của người dùng
     * @return Danh sách đơn hàng được sắp xếp theo thời gian tạo giảm dần
     */
    @Override
    public List<OrderResponseDTO> getMyOrders(Integer userId) {
        //Tìm đơn hàng theo userId, sắp xếp mới nhất lên đầu và map sang DTO
        return orderRepository.findByUser_UserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(order -> OrderResponseDTO.builder()
                                .orderId(order.getOrderId())
                                .status(order.getStatus().name())
                                .totalPrice(order.getTotalPrice())
                                .recipientName(order.getRecipientName())
                                .createdAt(order.getCreatedAt())
                                .build())
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách đơn hàng dành cho Admin, hỗ trợ lọc và phân trang.
     *
     * @param status  Trạng thái đơn hàng cần lọc - không bắt buộc
     * @param keyword Từ khóa tìm kiếm theo tên người nhận hoặc số điện thoại - không bắt buộc
     * @param page    Số trang cần lấy
     * @param size    Số lượng bản ghi trên mỗi trang
     * @return Danh sách đơn hàng dạng phân trang
     */
    @Override
    public Page<OrderListDTO> getAdminOrders(String status, String keyword, int page, int size) {
        //Cấu hình phân trang, mặc định sắp xếp theo ngày tạo giảm dần (mới nhất trước)
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        //Chuyển trạng thái từ String sang Enum
        OrderStatus orderStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                orderStatus = OrderStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                //Bỏ qua nếu Client gửi lên Status không tồn tại trong Enum
            }
        }

        //Gọi query để tìm kiếm và lọc
        Page<Order> orderPage = orderRepository.searchAdminOrders(orderStatus, keyword, pageable);

        //Chuyển đổi từ entity Order sang dto OrderListDTO để trả về
        return orderPage.map(order -> OrderListDTO.builder()
                .orderId(order.getOrderId())
                .recipientName(order.getRecipientName())
                .recipientPhone(order.getRecipientPhone())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus().name())
                .createdAt(order.getCreatedAt())
                .build()
            );
    }

    /**
     * Lấy thông tin chi tiết của một đơn hàng dành cho Admin.
     *
     * Thông tin trả về bao gồm:
     * - Thông tin chung của đơn hàng
     * - Danh sách sản phẩm trong đơn
     * - Thông tin thanh toán
     *
     * Xử lý thêm các trường hợp:
     * - Không tìm thấy đơn hàng
     * - Sản phẩm trong đơn đã bị xóa khỏi hệ thống
     * - Đơn hàng chưa có thông tin thanh toán
     *
     * @param orderId ID của đơn hàng cần xem chi tiết
     * @return Thông tin chi tiết đầy đủ của đơn hàng
     */
    @Override
    @Transactional(readOnly = true)
    public OrderDetailResponseDTO getOrderDetailForAdmin(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                        .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại hoặc đã bị xóa"));
        
        List<OrderItemDTO> items = orderItemRepository.findByOrder(order)
            .stream()
            .map(this::mapToOrderItemDTO)
            .collect(Collectors.toList());

        Optional<Payment> paymentOpt = paymentRepository.findByOrder_OrderId(orderId);

        return buildOrderDetailResponse(order, paymentOpt, items);
    }

    /**
     * Chuyển đổi từ OrderItem Entity sang OrderItemDTO.
     *
     * Ngoài việc mapping dữ liệu cơ bản, method này còn:
     * - Tính thành tiền của từng sản phẩm
     * - Kiểm tra sản phẩm đã bị xóa khỏi hệ thống hay chưa
     *
     * @param item Entity chi tiết đơn hàng
     * @return DTO chi tiết sản phẩm trong đơn hàng
     */
    private OrderItemDTO mapToOrderItemDTO(OrderItem item) {
        boolean discontinued = item.getProduct() == null;

        BigDecimal subTotal = item.getPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity()));

        return OrderItemDTO.builder()
                .orderItemId(item.getOrderItemId())
                .productId(item.getProduct() != null ? item.getProduct().getProductId() : null)
                .productName(item.getProductName())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .subTotal(subTotal)
                .discontinued(discontinued)
                .note(discontinued ? PRODUCT_DISCONTINUED_NOTE : null)
                .build();
    }

    /**
     * Tạo OrderDetailResponseDTO từ dữ liệu Order, Payment và danh sách OrderItemDTO.
     *
     * Nếu đơn hàng có thông tin thanh toán:
     * - Gán đầy đủ thông tin payment
     *
     * Nếu đơn hàng chưa có thông tin thanh toán:
     * - Gán message thông báo phù hợp
     *
     * @param order      Thông tin đơn hàng
     * @param paymentOpt Thông tin thanh toán, có thể rỗng
     * @param items      Danh sách sản phẩm trong đơn
     * @return DTO chi tiết đơn hàng hoàn chỉnh
     */
    private OrderDetailResponseDTO buildOrderDetailResponse(
        Order order,
        Optional<Payment> paymentOpt,
        List<OrderItemDTO> items
    ) {
        OrderDetailResponseDTO.OrderDetailResponseDTOBuilder builder = OrderDetailResponseDTO.builder()
            .orderId(order.getOrderId())
            .customerName(order.getUser() != null ? order.getUser().getName() : null)
            .recipientName(order.getRecipientName())
            .recipientPhone(order.getRecipientPhone())
            .shippingAddress(order.getShippingAddress())
            .status(order.getStatus().name())
            .createdAt(order.getCreatedAt())
            .totalPrice(order.getTotalPrice())
            .items(items);

        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            builder.hasPayment(true)
                .paymentMethod(payment.getPaymentMethod() != null ? payment.getPaymentMethod().name() : null)
                .paymentStatus(payment.getStatus() != null ? payment.getStatus().name() : null)
                .paymentAmount(payment.getAmount())
                .transactionNo(payment.getTransactionNo())
                .paymentDate(payment.getPaymentDate())
                .paymentMessage(null);
        } else {
            builder.hasPayment(false)
                .paymentMethod(null)
                .paymentStatus(null)
                .paymentAmount(null)
                .transactionNo(null)
                .paymentDate(null)
                .paymentMessage(NO_PAYMENT_MESSAGE);
        }

        return builder.build();
    }
}
