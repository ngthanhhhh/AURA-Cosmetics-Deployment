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
import com.cosmetics.ecommerce.exception.BadRequestException;

import java.util.Map;

/**
 * API quản lý khách hàng dành cho quản trị viên.
 *
 * Bao gồm:
 * - Xem danh sách khách hàng
 * - Xem chi tiết khách hàng
 * - Khóa/mở khóa tài khoản khách hàng
 */
@RestController
@RequestMapping("/api/v1/admin/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    /**
     * Lấy danh sách khách hàng có hỗ trợ tìm kiếm, lọc trạng thái,
     * phân trang và sắp xếp.
     *
     * @param keyword Từ khóa tìm kiếm theo tên hoặc email.
     * @param isActive Trạng thái hoạt động của tài khoản.
     * @param page Trang hiện tại.
     * @param size Số lượng bản ghi mỗi trang.
     * @param sort Trường và hướng sắp xếp, ví dụ createdAt,desc.
     * @return Danh sách khách hàng dạng phân trang.
     */
    @GetMapping
    public ResponseEntity<Page<CustomerResponse>> getCustomers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort)
    {

        if(page < 0){
            throw new BadRequestException("Số trang không hợp lệ");
        }

        if(size <= 0){
            throw new BadRequestException("Kích thước trang không hợp lệ");
        }

        if(size > 100){
            throw new BadRequestException("Kích thước trang quá lớn");
        }

        String[] sortParams = sort.split(",");
        String sortField = sortParams[0].isBlank()
                ? "createdAt"
                : sortParams[0];

        Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        return ResponseEntity.ok(customerService.getAllCustomers(keyword, isActive, pageable));
    }

    /**
     * Lấy thông tin chi tiết của một khách hàng.
     *
     * @param id ID khách hàng cần xem.
     * @return Thông tin chi tiết khách hàng và lịch sử đơn hàng.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CustomerDetailResponse> getCustomerDetail(@PathVariable Integer id){
        return ResponseEntity.ok(customerService.getCustomerDetail(id));
    }

    /**
     * Khóa hoặc mở khóa tài khoản khách hàng.
     *
     * @param id ID khách hàng cần cập nhật trạng thái.
     * @param request Body chứa isActive.
     * @return Thông báo cập nhật trạng thái thành công.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, Boolean> request
    ){
        Boolean isActive = request.get("isActive");

        if (isActive == null){
            throw new BadRequestException("Thiếu trạng thái tài khoản");
        }

        customerService.updateStatus(id, isActive);

        return ResponseEntity.ok(
                Map.of("message", "Cập nhật trạng thái khách hàng thành công"));

    }


}
