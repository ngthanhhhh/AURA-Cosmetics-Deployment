package com.cosmetics.ecommerce.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
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
import com.cosmetics.ecommerce.dto.OrderItemPrototype;
import com.cosmetics.ecommerce.dto.OrderListDTO;
import com.cosmetics.ecommerce.dto.OrderRequestDTO;
import com.cosmetics.ecommerce.dto.OrderResponseDTO;
import com.cosmetics.ecommerce.dto.OrderStatusUpdateResponseDTO;
import com.cosmetics.ecommerce.dto.UpdateOrderStatusRequestDTO;
import com.cosmetics.ecommerce.entity.*;
import com.cosmetics.ecommerce.enums.OrderStatus;
import com.cosmetics.ecommerce.enums.PaymentMethod;
import com.cosmetics.ecommerce.enums.PaymentStatus;
import com.cosmetics.ecommerce.enums.ProductStatus;
import com.cosmetics.ecommerce.exception.ResourceNotFoundException;
import com.cosmetics.ecommerce.repository.CartItemRepository;
import com.cosmetics.ecommerce.repository.CartRepository;
import com.cosmetics.ecommerce.repository.OrderItemRepository;
import com.cosmetics.ecommerce.repository.OrderRepository;
import com.cosmetics.ecommerce.repository.PaymentRepository;
import com.cosmetics.ecommerce.repository.ProductRepository;
import com.cosmetics.ecommerce.repository.UserRepository;
import com.cosmetics.ecommerce.service.OrderService;

import java.util.Collections;
import lombok.RequiredArgsConstructor;

/**
 * Service triển khai các nghiệp vụ liên quan đến đơn hàng.
 *
 * Bao gồm các chức năng chính như đặt hàng, xem lịch sử và chi tiết đơn hàng,
 * quản lý danh sách đơn hàng cho Admin, cập nhật trạng thái đơn hàng,
 * xác nhận thanh toán COD và hoàn kho khi hủy đơn.
 *
 * Service này đồng thời kiểm tra luồng chuyển trạng thái, điều kiện thanh toán
 * và tạo snapshot OrderItem tại thời điểm checkout.
 */
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService{

    private static final String NO_PAYMENT_MESSAGE = "Chưa có thông tin thanh toán";
    private static final Set<String> ORDER_SORT_FIELDS = Set.of(
        "orderId",
        "createdAt",
        "updatedAt",
        "totalPrice",
        "status"
    );

    /**
     * Quy tắc chuyển đổi trạng thái đơn hàng.
     *
     * Key: trạng thái hiện tại
     * Value: danh sách trạng thái được phép chuyển tới
     *
     * Dùng để đảm bảo:
     * - Không cho quay ngược quy trình
     * - Không cho chuyển trạng thái sai logic nghiệp vụ
     */
    private static final Map<OrderStatus, Set<OrderStatus>> VALID_TRANSITIONS = Map.of(
        OrderStatus.PENDING, Set.of(OrderStatus.PREPARING, OrderStatus.CANCELLED),
        OrderStatus.PREPARING, Set.of(OrderStatus.SHIPPING, OrderStatus.CANCELLED),
        OrderStatus.SHIPPING, Set.of(OrderStatus.DELIVERED),
        OrderStatus.DELIVERED, Set.of(OrderStatus.COMPLETED),
        OrderStatus.COMPLETED, Collections.emptySet(),
        OrderStatus.CANCELLED, Collections.emptySet()
    );

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
     * - Kiểm tra userId và request đặt hàng hợp lệ
     * - Kiểm tra người dùng tồn tại
     * - Lấy giỏ hàng hiện có của người dùng và kiểm tra giỏ không rỗng
     * - Tạo đơn hàng với trạng thái mặc định là PENDING
     * - Duyệt từng sản phẩm trong giỏ:
     *   + Khóa sản phẩm khi kiểm tra tồn kho
     *   + Kiểm tra sản phẩm còn kinh doanh
     *   + Kiểm tra số lượng tồn kho
     *   + Trừ số lượng tồn kho
     *   + Tạo snapshot OrderItem bằng Prototype để lưu tên, giá tại thời điểm đặt hàng
     * - Cập nhật tổng tiền cuối cùng cho đơn hàng
     * - Tạo bản ghi thanh toán với trạng thái PENDING
     * - Xóa giỏ hàng sau khi đặt hàng thành công
     * - Trả về thông tin đơn hàng cho client
     *
     * @param userId  ID của người dùng đang đặt hàng
     * @param request Thông tin người nhận, địa chỉ giao hàng và phương thức thanh toán
     * @return Thông tin đơn hàng sau khi đặt thành công
     */
    @Override
    @Transactional
    public OrderResponseDTO placeOrder(Integer userId, OrderRequestDTO request) {

        validateUserId(userId); // kiểm tra giá trị userId truyền vào có hợp lệ không
        validateOrderRequest(request);

        //1. Kiểm tra sự tồn tại của User
        User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng!"));

        //2. Lấy giỏ hàng của User và kiểm tra tính hợp lệ
        Cart cart = cartRepository.findByUser_UserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng của bạn hiện đang trống!"));

        List<CartItem> cartItems = new ArrayList<>(cart.getCartItems());
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

        Order savedOrder = orderRepository.save(order); //OrderItem cần biết nó thuộc về đơn hàng số mấy.
        BigDecimal totalAmount = BigDecimal.ZERO;

        //4. Xử lý từng sản phẩm trong giỏ: Kiểm tra kho, trừ kho và tạo chi tiết đơn hàng (OrderItem)
        for (CartItem item : cartItems) {
            //Sử dụng Pessimistic Lock (findByIdWithLock) để khóa row sản phẩm trong csdl.
            //-> Ngăn tình trạng "Race Condition" khi nhiều người cùng mua 1 món hàng cuối cùng lúc.
            Product product = productRepository.findByIdWithLock(item.getProduct().getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại!"));

            if (product.getStatus() != ProductStatus.ACTIVE) {
                throw new BadRequestException("Sản phẩm " + product.getName() + " đã ngừng bán!");
            }

            //Kiểm tra số lượng tồn kho
            if (product.getStock() < item.getQuantity()){
                throw new BadRequestException("Sản phẩm " + product.getName() + " đã hết hàng hoặc không đủ số lượng trong kho");
            }

            //Trừ số lượng kho thực tế và lưu lại
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);

            // Tạo dữ liệu sản phẩm tại thời điểm checkout (từ Product + CartItem)
            // → đây là object mẫu (prototype)
            OrderItemPrototype productData = OrderItemPrototype.from(product, item.getQuantity());

            // Clone object mẫu để tạo snapshot độc lập
            // → dữ liệu này sẽ không bị ảnh hưởng nếu Product thay đổi sau này
            OrderItemPrototype snapshotData = productData.clone();

            // Tạo OrderItem từ snapshot để lưu vào database
            // → đảm bảo lưu đúng tên và giá tại thời điểm khách đặt hàng
            OrderItem orderItem = snapshotData.toOrderItem(savedOrder, product);
            orderItemRepository.save(orderItem);


            // Tính tổng tiền dựa trên snapshot (không dùng trực tiếp Product)
            // → đảm bảo nhất quán với dữ liệu đã lưu trong OrderItem
            BigDecimal itemTotal = snapshotData.getPrice().multiply(BigDecimal.valueOf(snapshotData.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        //5. Cập nhật lại tổng tiền cuối cùng cho đơn hàng
        savedOrder.setTotalPrice(totalAmount);
        orderRepository.save(savedOrder);

        //6. Tạo bản ghi thanh toán tương ứng với đơn hàng
        // Payment ban đầu luôn ở trạng thái PENDING.
        // Với VNPay, trạng thái sẽ được cập nhật sau callback.
        // Với COD, trạng thái được xác nhận trong quá trình xử lý/giao hàng.
        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setAmount(totalAmount);
        payment.setPaymentMethod(parsePaymentMethod(request.getPaymentMethod()));
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
     * Lấy danh sách đơn hàng của người dùng hiện tại.
     *
     * API/service này hỗ trợ:
     * - Lọc theo trạng thái đơn hàng
     * - Tìm kiếm theo từ khóa
     * - Phân trang
     * - Sắp xếp theo trường và chiều sắp xếp được truyền vào
     *
     * @param userId  ID của người dùng cần lấy danh sách đơn hàng.
     * @param status  Trạng thái đơn hàng cần lọc, ví dụ: PENDING, PREPARING, SHIPPING,...
     *                Không bắt buộc.
     * @param keyword Từ khóa tìm kiếm theo thông tin đơn hàng. Không bắt buộc.
     * @param page    Số thứ tự trang muốn lấy, mặc định thường là 0.
     * @param size    Số lượng đơn hàng trên mỗi trang.
     * @param sortBy  Trường dùng để sắp xếp, ví dụ: createdAt, totalPrice, status.
     * @param sortDir Chiều sắp xếp, gồm asc hoặc desc.
     * @return Page chứa danh sách đơn hàng của người dùng sau khi lọc, tìm kiếm,
     *         phân trang, sắp xếp và chuyển sang OrderResponseDTO.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponseDTO> getMyOrders(
        Integer userId,
        String status,
        String keyword,
        int page,
        int size,
        String sortBy,
        String sortDir
    ) {

        validateUserId(userId);

        OrderStatus orderStatus = parseNullableOrderStatus(status);
        Pageable pageable = buildOrderPageable(page, size, sortBy, sortDir); //Tạo thông tin phân trang và sắp xếp.

        //Tìm đơn hàng theo userId, áp dụng lọc/tìm kiếm/phân trang và map sang DTO
        return orderRepository.searchMyOrders(
            userId,
            orderStatus,
            normalizeKeyword(keyword),
            pageable
        ).map(order -> OrderResponseDTO.builder()
                        .orderId(order.getOrderId())
                        .status(order.getStatus().name())
                        .totalPrice(order.getTotalPrice())
                        .recipientName(order.getRecipientName())
                        .recipientPhone(order.getRecipientPhone())
                        .shippingAddress(order.getShippingAddress())
                        .createdAt(order.getCreatedAt())
                        .build()
        );
    }

    /**
     * Lấy danh sách đơn hàng dành cho Admin.
     *
     * Method này hỗ trợ:
     * - Lọc theo trạng thái đơn hàng
     * - Lọc theo phương thức thanh toán
     * - Lọc theo trạng thái thanh toán
     * - Tìm kiếm theo từ khóa
     * - Phân trang
     * - Sắp xếp
     *
     * @param status        Trạng thái đơn hàng cần lọc, ví dụ: PENDING, PREPARING, SHIPPING,...
     *                      Không bắt buộc.
     * @param keyword       Từ khóa tìm kiếm theo thông tin đơn hàng hoặc người nhận.
     *                      Không bắt buộc.
     * @param paymentMethod Phương thức thanh toán cần lọc, ví dụ: COD, VNPAY.
     *                      Không bắt buộc.
     * @param paymentStatus Trạng thái thanh toán cần lọc, ví dụ: PENDING, SUCCESS, FAILED.
     *                      Không bắt buộc.
     * @param page          Số thứ tự trang cần lấy.
     * @param size          Số lượng bản ghi trên mỗi trang.
     * @param sortBy        Trường dùng để sắp xếp, ví dụ: createdAt, totalPrice, status.
     * @param sortDir       Chiều sắp xếp, gồm asc hoặc desc.
     * @return Page danh sách đơn hàng sau khi lọc, tìm kiếm, phân trang,
     *         sắp xếp và chuyển sang OrderListDTO.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<OrderListDTO> getAdminOrders(
        String status, 
        String keyword, 
        String paymentMethod,
        String paymentStatus,    
        int page, 
        int size,
        String sortBy,
        String sortDir
    ) {
        // Nếu không truyền gì thì để null nghĩa là không lọc theo điều kiện đó.
        OrderStatus orderStatus = parseNullableOrderStatus(status);
        PaymentMethod parsedPaymentMethod = parseNullablePaymentMethod(paymentMethod);
        PaymentStatus parsedPaymentStatus = parseNullablePaymentStatus(paymentStatus);

        Pageable pageable = buildOrderPageable(page, size, sortBy, sortDir);

        //Gọi query để tìm kiếm và lọc
        Page<Order> orderPage = orderRepository.searchAdminOrders(
            orderStatus, 
            normalizeKeyword(keyword),
            parsedPaymentMethod,
            parsedPaymentStatus, 
            pageable);

        //Chuyển đổi từ entity Order sang dto OrderListDTO để trả về
        return orderPage.map(order -> {
            
            Payment payment = paymentRepository
                .findByOrder_OrderId(order.getOrderId())
                .orElse(null);

            return OrderListDTO.builder()
                .orderId(order.getOrderId())
                .recipientName(order.getRecipientName())
                .recipientPhone(order.getRecipientPhone())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus().name())
                .paymentMethod(
                    payment != null && payment.getPaymentMethod() != null
                        ? payment.getPaymentMethod().name() : null   
                )
                .paymentStatus(
                    payment != null && payment.getStatus() != null
                        ? payment.getStatus().name() : null
                )
                .createdAt(order.getCreatedAt())
                .build();
        });
    }

    /**
     * Lấy thông tin chi tiết của một đơn hàng dành cho Admin.
     *
     * Thông tin trả về bao gồm:
     * - Thông tin chung của đơn hàng
     * - Danh sách sản phẩm trong đơn hàng
     * - Thông tin thanh toán
     *
     * Xử lý thêm các trường hợp:
     * - Không tìm thấy đơn hàng
     * - Sản phẩm trong đơn đã ngừng kinh doanh hoặc không còn đầy đủ thông tin
     * - Không tìm thấy thông tin thanh toán do dữ liệu bất thường
     *
     * @param orderId ID của đơn hàng cần xem chi tiết
     * @return Thông tin chi tiết đầy đủ của đơn hàng
     */
    @Override
    @Transactional(readOnly = true)
    public OrderDetailResponseDTO getOrderDetailForAdmin(Integer orderId) {
        validateOrderId(orderId);

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
     * Cập nhật trạng thái đơn hàng cho Admin.
     *
     * Flow xử lý:
     * - Kiểm tra orderId hợp lệ
     * - Validate request cập nhật trạng thái
     * - Tìm đơn hàng theo orderId
     * - Parse trạng thái mới từ request
     * - Kiểm tra đơn hàng có đang ở trạng thái đó chưa
     * - Kiểm tra luồng chuyển trạng thái hợp lệ
     * - Kiểm tra điều kiện thanh toán trước khi xử lý trạng thái mới
     * - Kiểm tra thanh toán nếu chuyển sang COMPLETED
     * - Hoàn kho nếu chuyển sang CANCELLED
     * - Cập nhật trạng thái đơn hàng và lưu vào database
     *
     * @param orderId ID của đơn hàng cần cập nhật
     * @param request Dữ liệu chứa trạng thái mới
     * @return DTO chứa trạng thái cũ, trạng thái mới, message kết quả
     *         và danh sách trạng thái tiếp theo dùng cho frontend
     */
    @Override
    @Transactional
    public OrderStatusUpdateResponseDTO updateOrderStatus(Integer orderId, UpdateOrderStatusRequestDTO request) {
        validateOrderId(orderId);
        validateUpdateStatusRequest(request);
        Order order = orderRepository.findById(orderId)
                        .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại hoặc đã bị xóa!"));

        OrderStatus currentStatus = order.getStatus();
        OrderStatus newStatus = parseOrderStatus(request.getStatus());

        if (currentStatus == newStatus) {
            throw new BadRequestException("Đơn hàng đang ở trạng thái " + currentStatus.name());
        }

        validateStatusTransition(currentStatus, newStatus);

        validatePaymentBeforeProcessing(order, newStatus);

        // Nếu muốn chuyển sang COMPLETED thì 
        // bắt buộc kiểm tra payment đã hợp lệ/thành công.
        if (newStatus == OrderStatus.COMPLETED) {
            validatePaymentForCompletion(orderId);
        }

        // Nếu hủy đơn thì hoàn lại số lượng sản phẩm vào kho.
        if (newStatus == OrderStatus.CANCELLED) {
            restockProductsIfNeeded(order);
        }

        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);

        return OrderStatusUpdateResponseDTO.builder()
                .orderId(updatedOrder.getOrderId())
                .oldStatus(currentStatus.name())
                .newStatus(updatedOrder.getStatus().name())
                .message(buildUpdateStatusMessage(newStatus))
                .availableNextStatus(getAvailableNextStatuses(updatedOrder.getStatus()))
                .build();
    }

    /**
     * Lấy thông tin chi tiết của một đơn hàng dành cho khách hàng.
     *
     * Method này chỉ cho phép người dùng xem đơn hàng thuộc về chính mình.
     *
     * Quy trình xử lý:
     * - Tìm đơn hàng theo orderId
     * - Kiểm tra đơn hàng có thuộc về userId hiện tại hay không
     * - Lấy danh sách sản phẩm trong đơn hàng
     * - Lấy thông tin thanh toán của đơn hàng
     * - Đóng gói dữ liệu thành OrderDetailResponseDTO để trả về
     *
     * @param userId  ID của người dùng hiện tại
     * @param orderId ID của đơn hàng cần xem chi tiết
     * @return Thông tin chi tiết của đơn hàng
     */
    @Override
    @Transactional(readOnly = true)
    public OrderDetailResponseDTO getOrderDetailForCustomer(Integer userId, Integer orderId) {
        Order order = orderRepository.findById(orderId)
                        .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại hoặc đã bị xóa!"));
        if (order.getUser() == null|| !order.getUser().getUserId().equals(userId)) {
            throw new BadRequestException("Bạn không có quyền xem đơn hàng này");
        }

        List<OrderItemDTO> items = orderItemRepository.findByOrder(order) //lấy danh sách OrderItem thuộc về đơn hàng này
            .stream() // bắt đầu duyệt từng phần tử trong list
            .map(this::mapToOrderItemDTO)
            .collect(Collectors.toList());

        Optional<Payment> paymentOpt = paymentRepository.findByOrder_OrderId(orderId);
        return buildOrderDetailResponse(order, paymentOpt, items);
    }

    /**
     * Xác nhận thanh toán thành công cho đơn hàng COD.
     *
     * Method này dùng khi Admin xác nhận đã thu tiền từ khách hàng
     * đối với đơn thanh toán khi nhận hàng.
     *
     * Quy trình xử lý:
     * - Kiểm tra orderId hợp lệ
     * - Tìm đơn hàng theo orderId
     * - Tìm thông tin thanh toán của đơn hàng
     * - Kiểm tra đơn hàng có dùng phương thức COD hay không
     * - Kiểm tra đơn hàng đã được xác nhận thanh toán trước đó chưa
     * - Chỉ cho phép xác nhận khi đơn hàng đã được giao
     * - Cập nhật trạng thái thanh toán sang SUCCESS
     * - Lưu thời gian xác nhận thanh toán
     *
     * @param orderId ID của đơn hàng cần xác nhận thanh toán COD
     */
    public void confirmCodPayment(Integer orderId) {
        validateOrderId(orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại!"));

        Payment payment = paymentRepository.findByOrder_OrderId(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin thanh toán!"));

        // Chỉ cho xác nhận thủ công với đơn COD. 
        // VNPay thì đã có callback xử lý riêng.
        if (payment.getPaymentMethod() != PaymentMethod.COD) {
            throw new BadRequestException(
                "Chỉ hỗ trợ xác nhận thanh toán cho đơn COD"
            );
        }

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            throw new BadRequestException("Đơn hàng này đã được xác nhận thanh toán!");
        }

        // Chỉ cho xác nhận COD khi đơn đã giao hoặc hoàn tất. 
        // Vì COD là trả tiền khi nhận hàng.
        if (order.getStatus() != OrderStatus.DELIVERED && order.getStatus() != OrderStatus.COMPLETED) {
            throw new BadRequestException("Chỉ có thể xác nhận thanh toán đơn khi đã giao");
        }

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaymentDate(LocalDateTime.now());

        paymentRepository.save(payment);
    }

    /**
     * Chuyển đổi từ OrderItem Entity sang OrderItemDTO.
     *
     * Ngoài việc mapping dữ liệu cơ bản, method này còn:
     * - Tính thành tiền của từng sản phẩm
     * - Kiểm tra sản phẩm đã bị xóa khỏi hệ thống hay chưa
     * - Thêm ghi chú nếu sản phẩm không còn tồn tại/liên kết
     *
     * @param item Entity chi tiết đơn hàng
     * @return DTO chi tiết sản phẩm trong đơn hàng
     */
    private OrderItemDTO mapToOrderItemDTO(OrderItem item) {
        Product product = item.getProduct();
    
        boolean discontinued = product == null || product.getStatus() != ProductStatus.ACTIVE;

        BigDecimal subTotal = item.getPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity()));

        String note = null;

        if (product == null) {
            note = "Sản phẩm đã bị xóa khỏi hệ thống.";
        } else if (product.getStatus() != ProductStatus.ACTIVE) {
            note = "Sản phẩm này hiện đã ngừng kinh doanh";
        }

        return OrderItemDTO.builder()
                .orderItemId(item.getOrderItemId())
                .productId(product != null ? product.getProductId() : null)
                .productName(item.getProductName())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .subTotal(subTotal)
                .discontinued(discontinued)
                .note(note)
                .build();
    }

    /**
     * Tạo OrderDetailResponseDTO từ dữ liệu Order, Payment và danh sách OrderItemDTO.
     *
     * Method này gom các dữ liệu liên quan đến chi tiết đơn hàng
     * thành một DTO hoàn chỉnh để trả về cho client.
     *
     * Nếu tìm thấy thông tin thanh toán:
     * - Gán đầy đủ paymentMethod, paymentStatus, paymentAmount,
     *   transactionNo và paymentDate.
     *
     * Nếu không tìm thấy thông tin thanh toán do dữ liệu bất thường:
     * - Đánh dấu hasPayment = false
     * - Gán các trường payment là null
     * - Gán paymentMessage để thông báo tình trạng thiếu dữ liệu thanh toán
     *
     * @param order      Thông tin đơn hàng
     * @param paymentOpt Thông tin thanh toán dưới dạng Optional
     * @param items      Danh sách sản phẩm trong đơn hàng
     * @return DTO chi tiết đơn hàng hoàn chỉnh
     */
    private OrderDetailResponseDTO buildOrderDetailResponse(
        Order order,
        Optional<Payment> paymentOpt,
        List<OrderItemDTO> items
    ) {
        // Tạo builder tạm để bắt đầu dựng OrderDetailResponseDTO
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

    /**
     * Kiểm tra request cập nhật trạng thái đơn hàng.
     *
     * Method này đảm bảo request không bị null
     * và trạng thái mới không được để trống.
     *
     * @param request Dữ liệu cập nhật trạng thái đơn hàng
     */
    private void validateUpdateStatusRequest(UpdateOrderStatusRequestDTO request) {
        if (request == null) {
            throw new BadRequestException("Request cập nhật trạng thái không hợp lệ!");
        }

        if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            throw new BadRequestException("Trạng thái đơn hàng không được để trống!");
        }
    }

    /**
     * Chuyển đổi String status sang enum OrderStatus.
     *
     * @param status Giá trị trạng thái dạng String từ request
     * @return Giá trị OrderStatus hợp lệ dùng cho xử lý nghiệp vụ
     */
    private OrderStatus parseOrderStatus(String status) {
        try {
            return OrderStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Trạng thái đơn hàng không hợp lệ!");
        }
    }

    /**
     * Kiểm tra việc chuyển trạng thái đơn hàng có hợp lệ hay không.
     *
     * Method này dựa vào bảng VALID_TRANSITIONS để xác định
     * trạng thái hiện tại được phép chuyển sang những trạng thái nào.
     *
     * @param currentStatus Trạng thái hiện tại của đơn hàng
     * @param newStatus     Trạng thái mới muốn chuyển sang
     */
    private void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        Set<OrderStatus> allowedStatuses = VALID_TRANSITIONS.getOrDefault(currentStatus, Collections.emptySet());
    
        if (!allowedStatuses.contains(newStatus)) {
            throw new BadRequestException(
                "Chuyển đổi trạng thái không hợp lệ. Đơn hàng đang ở trạng thái "
                + currentStatus.name() + ". không thể chuyển sang " + newStatus.name()
            );
        }
    }

    /**
     * Kiểm tra điều kiện thanh toán trước khi hoàn thành đơn hàng.
     *
     * Đơn hàng chỉ được chuyển sang COMPLETED khi đã có thông tin thanh toán
     * và trạng thái thanh toán là SUCCESS.
     *
     * @param orderId ID của đơn hàng cần kiểm tra thanh toán
     */
    private void validatePaymentForCompletion(Integer orderId) {
        Payment payment = paymentRepository.findByOrder_OrderId(orderId)
            .orElseThrow(() -> new BadRequestException("Không thể hoàn thành đơn hàng do chưa có thông tin thanh toán!"));
    
        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new BadRequestException("Không thể hoàn thành đơn hàng do chưa xác nhận thanh toán thành công");
        }
    }

    /**
     * Kiểm tra điều kiện thanh toán trước khi xử lý trạng thái mới của đơn hàng.
     *
     * Nếu đơn hàng bị hủy thì bỏ qua kiểm tra thanh toán.
     * Nếu đơn hàng thanh toán bằng VNPay thì chỉ cho xử lý tiếp
     * khi thanh toán đã thành công.
     *
     * @param order     Đơn hàng cần kiểm tra
     * @param newStatus Trạng thái mới muốn cập nhật
     */
    private void validatePaymentBeforeProcessing(Order order, OrderStatus newStatus) {
        if (newStatus == OrderStatus.CANCELLED) {
            return;
        }

        Payment payment = paymentRepository.findByOrder_OrderId(order.getOrderId())
                .orElseThrow(() -> new BadRequestException(
                        "Không thể cập nhật trạng thái do chưa có thông tin thanh toán!"
                ));

        if (payment.getPaymentMethod() == PaymentMethod.VNPAY
                && payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new BadRequestException(
                    "Không thể xử lý đơn VNPay khi thanh toán chưa thành công!"
            );
        }
    }

    /**
     * Kiểm tra điều kiện hủy đơn và hoàn lại số lượng sản phẩm vào kho.
     *
     * Method này chỉ cho phép hoàn kho khi đơn hàng còn có thể hủy.
     * Nếu đơn hàng đã giao thành công, đã hoàn thành hoặc đã thanh toán thành công
     * thì không cho phép hủy.
     *
     * @param order Đơn hàng cần xử lý khi hủy
     * @throws BadRequestException nếu đơn hàng không đủ điều kiện để hủy
     *
     * Side effect:
     * - Cập nhật lại stock trong bảng Product
     */
    private void restockProductsIfNeeded(Order order) {
        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.COMPLETED) {
            throw new BadRequestException("Không thể hủy đơn hàng đã giao thành công hoặc đã hoàn thành!");
        }

        Payment payment = paymentRepository.findByOrder_OrderId(order.getOrderId()).orElse(null);

        if (payment != null && payment.getStatus() == PaymentStatus.SUCCESS) {
            throw new BadRequestException("Không thể hủy đơn hàng đã thanh toán thành công!");
        }

        // Lấy danh sách sản phẩm trong đơn hàng.
        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);

        for (OrderItem item : orderItems) {
            // Nếu item không còn liên kết với product thì bỏ qua item này, 
            // chuyển sang item tiếp theo.
            if (item.getProduct() == null) continue;

            // Tìm sản phẩm theo id và khóa dòng sản phẩm đó trong database.
            Product lockedProduct = productRepository.findByIdWithLock(item.getProduct().getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại trong hệ thống!"));

            // Hoàn kho: stock mới = stock hiện tại + số lượng đã mua trong đơn
            lockedProduct.setStock(lockedProduct.getStock() + item.getQuantity());
            productRepository.save(lockedProduct);
        }
    }

    /**
     * Tạo message phản hồi sau khi cập nhật trạng thái đơn hàng.
     *
     * Nếu trạng thái mới là CANCELLED, message sẽ thông báo thêm
     * rằng sản phẩm trong đơn đã được hoàn lại vào kho.
     * Các trạng thái còn lại trả về message cập nhật thành công chung.
     *
     * @param newStatus Trạng thái mới của đơn hàng sau khi cập nhật
     * @return Message thông báo kết quả cập nhật trạng thái
     */
    private String buildUpdateStatusMessage(OrderStatus newStatus) {
        if (newStatus == OrderStatus.CANCELLED) {
            return "Hủy đơn thành công và đã hoàn trả sản phẩm vào kho hàng!";
        }
        return "Cập nhật trạng thái thành công";
    }

    /**
     * Lấy danh sách trạng thái tiếp theo hợp lệ.
     *
     * @param currentStatus Trạng thái hiện tại của đơn hàng
     * @return Danh sách trạng thái có thể chuyển tiếp (dùng cho FE hiển thị dropdown)
     */
    private List<String> getAvailableNextStatuses(OrderStatus currentStatus) {
        return VALID_TRANSITIONS.getOrDefault(currentStatus, Collections.emptySet())
                .stream()
                .map(Enum::name) //Đổi từng enum thành String.
                .sorted()
                .collect(Collectors.toList()); //Gom kết quả lại thành List<String>
    }

    private void validateOrderRequest(OrderRequestDTO request) {
        if (request == null) {
            throw new BadRequestException("Thông tin đặt hàng không hợp lệ!");
        }

        if (request.getRecipientName() == null || request.getRecipientName().trim().isEmpty()) {
            throw new BadRequestException("Họ tên không được để trống!");
        }

        if (request.getRecipientPhone() == null || !request.getRecipientPhone().matches("^\\d{10}$")) {
            throw new BadRequestException("Số điện thoại không hợp lệ, vui lòng nhập đủ 10 chữ số!");
        }

        if (request.getShippingAddress() == null || request.getShippingAddress().trim().isEmpty()) {
            throw new BadRequestException("Địa chỉ nhận hàng không được để trống!");
        }

        parsePaymentMethod(request.getPaymentMethod());
    }

    private PaymentMethod parsePaymentMethod(String paymentMethod) {
        if (paymentMethod == null || paymentMethod.trim().isEmpty()) {
            throw new BadRequestException("Phương thức thanh toán không được để trống!");
        }

        try {
            return PaymentMethod.valueOf(paymentMethod.trim().toUpperCase());
        } catch (IllegalArgumentException e){
            throw new BadRequestException("Phương thức thanh toán không hợp lệ! Chỉ hỗ trợ COD hoặc VNPAY.");
        }
    }

    private void validateUserId(Integer userId) {
        if (userId == null) {
            throw new BadRequestException("Người dùng không hợp lệ!");
        }
    }

    private void validateOrderId(Integer orderId) {
        if (orderId == null) {
            throw new BadRequestException("Mã đơn hàng không hợp lệ!");
        }
    }

    /**
     * Tạo đối tượng Pageable dùng cho truy vấn danh sách đơn hàng có phân trang và sắp xếp.
     *
     * Method này kiểm tra:
     * - Số trang không được âm
     * - Kích thước trang phải nằm trong khoảng 1 đến 100
     * - Trường sắp xếp phải thuộc danh sách cho phép
     * - Chiều sắp xếp phải hợp lệ
     *
     * Nếu client không truyền sortBy, hệ thống mặc định sắp xếp theo createdAt.
     *
     * @param page    Số thứ tự trang cần lấy, bắt đầu từ 0
     * @param size    Số lượng đơn hàng trên mỗi trang
     * @param sortBy  Trường dùng để sắp xếp
     * @param sortDir Chiều sắp xếp, gồm asc hoặc desc
     * @return Pageable chứa thông tin phân trang và sắp xếp
     */
    private Pageable buildOrderPageable(int page, int size, String sortBy, String sortDir) {
        if (page < 0) {
            throw new BadRequestException("Số trang không hợp lệ!");
        }

        if (size <= 0 || size > 100) {
            throw new BadRequestException("Kích thước trang phải từ 1 đến 100!");
        }
        
        String finalSortBy = (sortBy == null || sortBy.trim().isEmpty()) ? "createdAt" : sortBy.trim();
        if (!ORDER_SORT_FIELDS.contains(finalSortBy)) {
            throw new BadRequestException("Tiêu chí sắp xếp đơn hàng không hợp lệ!");
        }

        Sort.Direction direction = parseSortDirection(sortDir); //Chuyển chuỗi asc / desc thành kiểu Sort.Direction.

        return PageRequest.of(page, size, Sort.by(direction, finalSortBy));
    }

    /**
     * Chuyển đổi chuỗi hướng sắp xếp từ request sang Sort.Direction.
     *
     * Nếu client không truyền sortDir hoặc truyền rỗng,
     * hệ thống mặc định sắp xếp giảm dần theo DESC.
     *
     * Method này chỉ chấp nhận hai giá trị:
     * - asc: sắp xếp tăng dần
     * - desc: sắp xếp giảm dần
     *
     * @param sortDir Hướng sắp xếp dạng String từ request
     * @return Sort.Direction tương ứng dùng cho Pageable
     */
    private Sort.Direction parseSortDirection(String sortDir) {
        if (sortDir == null || sortDir.trim().isEmpty()) {
            return Sort.Direction.DESC;
        }

        if ("asc".equalsIgnoreCase(sortDir.trim())) {
            return Sort.Direction.ASC;
        }

        if ("desc".equalsIgnoreCase(sortDir.trim())) {
            return Sort.Direction.DESC;
        }

        throw new BadRequestException("Hướng sắp xếp chỉ được là asc hoặc desc!");
    }

    private OrderStatus parseNullableOrderStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            return null;
        }

        try {
            return OrderStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Trạng thái đơn hàng không hợp lệ!");
        }
    }

    private PaymentMethod parseNullablePaymentMethod(String paymentMethod) {
        if (paymentMethod == null || paymentMethod.trim().isEmpty()) {
            return null;
        }

        try {
            return PaymentMethod.valueOf(paymentMethod.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Phương thức thanh toán không hợp lệ!");
        }
    }

    private PaymentStatus parseNullablePaymentStatus(String paymentStatus) {
        if (paymentStatus == null || paymentStatus.trim().isEmpty()) {
            return null;
        }

        try {
            return PaymentStatus.valueOf(paymentStatus.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Trạng thái thanh toán không hợp lệ!");
        }
    }

    private String normalizeKeyword(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return null;
        }
        return keyword.trim();
    }
}
