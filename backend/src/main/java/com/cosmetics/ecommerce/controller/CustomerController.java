package com.cosmetics.ecommerce.controller;

import com.cosmetics.ecommerce.dto.CustomerDetailResponse;
import com.cosmetics.ecommerce.dto.CustomerResponse;
import com.cosmetics.ecommerce.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    //Xem danh sách khách hàng
    @GetMapping
    public ResponseEntity<Page<CustomerResponse>> getCustomers(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(customerService.getAllCustomers(keyword, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDetailResponse> getCustomerDetail(@PathVariable Integer id){
        return ResponseEntity.ok(customerService.getCustomerDetail(id));
    }

    ///{id}/status
    // Mở / Khóa tài khoản customer
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, Boolean> request
    ){
        Boolean isActive = request.get("isActive");

        customerService.updateStatus(id, isActive);

        return ResponseEntity.ok(
                Map.of("message", "Cập nhật trạng thái khách hàng thành công"));

    }


}
