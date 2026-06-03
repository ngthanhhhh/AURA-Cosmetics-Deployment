package com.cosmetics.ecommerce.service.impl;

import com.cosmetics.ecommerce.dto.OrderRequestDTO;
import com.cosmetics.ecommerce.dto.UpdateOrderStatusRequestDTO;
import com.cosmetics.ecommerce.entity.*;
import com.cosmetics.ecommerce.enums.OrderStatus;
import com.cosmetics.ecommerce.enums.PaymentMethod;
import com.cosmetics.ecommerce.enums.PaymentStatus;
import com.cosmetics.ecommerce.exception.BadRequestException;
import com.cosmetics.ecommerce.repository.*;
import com.cosmetics.ecommerce.service.OrderService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    @Test
    void placeOrder_ShouldThrowException_WhenCartIsEmpty(){
        User user = new User();
        user.setUserId(1);

        Cart cart = new Cart();
        cart.setCartId(1);
        cart.setUser(user);
        cart.setCartItems(new ArrayList<>());

        OrderRequestDTO request = new OrderRequestDTO();
        request.setRecipientName("Nguyen Van A");
        request.setRecipientPhone("0123456789");
        request.setShippingAddress("HCM");
        request.setPaymentMethod("COD");

        when(userRepository.findById(1))
                .thenReturn(Optional.of(user));

        when(cartRepository.findByUser_UserId(1))
                .thenReturn(Optional.of(cart));

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> orderService.placeOrder(1, request)
        );

        assertEquals(
                "Giỏ hàng của bạn đang trống, không thể đặt hàng!",
                exception.getMessage()
        );
    }

    @Test
    void updateOrderStatus_ShouldThrowException_WhenCompleteOrderButPaymentNotSuccess(){
        Order order = new Order();
        order.setOrderId(1);
        order.setStatus(OrderStatus.DELIVERED);
        order.setTotalPrice(BigDecimal.valueOf(500000));

        Payment payment = new Payment();
        payment.setPaymentMethod(PaymentMethod.COD);
        payment.setStatus(PaymentStatus.PENDING);

        UpdateOrderStatusRequestDTO request = new UpdateOrderStatusRequestDTO();
        request.setStatus("COMPLETED");

        when(orderRepository.findById(1))
                .thenReturn(Optional.of(order));

        when(paymentRepository.findByOrder_OrderId(1))
                .thenReturn(Optional.of(payment));

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> orderService.updateOrderStatus(1, request)
        );

        assertEquals(
                "Không thể hoàn thành đơn hàng do chưa xác nhận thanh toán thành công",
                exception.getMessage());

    }
}

