package com.cosmetics.ecommerce.service.impl;

import com.cosmetics.ecommerce.dto.CustomerResponse;
import com.cosmetics.ecommerce.dto.CustomerDetailResponse;
import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.repository.CustomerRepository;
import com.cosmetics.ecommerce.repository.OrderRepository;
import com.cosmetics.ecommerce.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements  CustomerService{

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;

    @Override
    public Page<CustomerResponse> getAllCustomers(String keyword, Pageable pageable){
        return customerRepository.findAllCustomers(keyword, pageable)
                .map(u -> new CustomerResponse(
                        u.getUserId(), u.getName(), u.getEmail(),
                        u.getPhone(), u.getCreatedAt(), u.getIsActive()
                ));
    }

    @Override
    public CustomerDetailResponse getCustomerDetail(Integer id){
        User user = customerRepository.findById(id)
                .filter(u -> u.getRole().getRoleName().equals("ROLE_CUSTOMER"))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + id));

        // Lấy lịch sử đơn hàng từ OrderRepository
        List<CustomerDetailResponse.OrderHistoryDTO> history = orderRepository.findByUserUserId(id)
                .stream()
                .map(o -> new CustomerDetailResponse.OrderHistoryDTO(
                        o.getOrderId(),
                        o.getCreatedAt(),
                        o.getTotalPrice(),
                        o.getStatus().name()

                )).toList();

        return new CustomerDetailResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress(),
                user.getCreatedAt(),
                user.getIsActive(),
                history
        );
    }
}
