package com.cosmetics.ecommerce.service.impl;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.cosmetics.ecommerce.entity.Category;
import com.cosmetics.ecommerce.exception.BadRequestException;
import com.cosmetics.ecommerce.exception.ResourceNotFoundException;
import com.cosmetics.ecommerce.repository.CategoryRepository;
import com.cosmetics.ecommerce.service.CategoryService;

import lombok.RequiredArgsConstructor;

/* =========================================================
 * CATEGORY SERVICE IMPLEMENTATION
 * ---------------------------------------------------------
 * Triển khai các nghiệp vụ liên quan đến danh mục sản phẩm.
 *
 * Chức năng chính:
 * - Lấy danh sách danh mục có tìm kiếm, phân trang, sắp xếp.
 * - Xem chi tiết danh mục.
 * - Thêm danh mục mới.
 * - Cập nhật thông tin danh mục.
 * - Xóa danh mục khỏi hệ thống.
 *
 * Các xử lý kiểm tra dữ liệu được đặt tại tầng Service để
 * Controller gọn hơn và đảm bảo nghiệp vụ được quản lý tập trung.
 * ========================================================= */
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    /* =========================================================
     * REPOSITORY TRUY XUẤT DỮ LIỆU DANH MỤC
     * ---------------------------------------------------------
     * Làm việc trực tiếp với bảng categories trong database.
     * ========================================================= */
    private final CategoryRepository categoryRepository;

    /* =========================================================
     * LẤY DANH SÁCH DANH MỤC
     * ---------------------------------------------------------
     * Xử lý:
     * - Kiểm tra page và size hợp lệ.
     * - Thiết lập trường sắp xếp mặc định nếu không truyền vào.
     * - Tạo Pageable phục vụ phân trang và sắp xếp.
     * - Nếu có keyword thì tìm kiếm theo tên danh mục.
     * - Nếu không có keyword thì lấy toàn bộ danh mục.
     * ========================================================= */
    @Override
    public Page<Category> getAll(
            String keyword,
            int page,
            int size,
            String sortBy,
            String direction
    ) {

        if (page < 0) {
            throw new BadRequestException("Số trang không hợp lệ");
        }

        if (size <= 0) {
            throw new BadRequestException("Kích thước trang không hợp lệ");
        }

        if (sortBy == null || sortBy.trim().isEmpty()) {
            sortBy = "categoryId";
        }

        Sort sort = "desc".equalsIgnoreCase(direction)
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        if (keyword != null && !keyword.trim().isEmpty()) {
            return categoryRepository.findByNameContainingIgnoreCase(
                    keyword.trim(),
                    pageable
            );
        }

        return categoryRepository.findAll(pageable);
    }

    /* =========================================================
     * LẤY CHI TIẾT DANH MỤC THEO ID
     * ---------------------------------------------------------
     * Nếu không tìm thấy danh mục, hệ thống ném ra
     * ResourceNotFoundException để báo lỗi cho client.
     * ========================================================= */
    @Override
    public Category getById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Danh mục không tồn tại"));
    }

    /* =========================================================
     * THÊM DANH MỤC MỚI
     * ---------------------------------------------------------
     * Xử lý:
     * - Kiểm tra dữ liệu danh mục hợp lệ.
     * - Chuẩn hóa tên danh mục bằng cách trim khoảng trắng.
     * - Kiểm tra tên danh mục đã tồn tại hay chưa.
     * - Lưu danh mục mới vào database.
     * ========================================================= */
    @Override
    public Category create(Category category) {

        validateCategory(category);

        String name = category.getName().trim();

        if (categoryRepository.existsByName(name)) {
            throw new BadRequestException("Tên danh mục đã tồn tại");
        }

        category.setName(name);

        return categoryRepository.save(category);
    }

    /* =========================================================
     * CẬP NHẬT DANH MỤC
     * ---------------------------------------------------------
     * Xử lý:
     * - Kiểm tra dữ liệu cập nhật hợp lệ.
     * - Tìm danh mục hiện tại theo ID.
     * - Chuẩn hóa tên danh mục mới.
     * - Nếu đổi tên, kiểm tra tên mới có bị trùng không.
     * - Cập nhật tên và mô tả danh mục.
     * ========================================================= */
    @Override
    public Category update(Integer id, Category category) {

        validateCategory(category);

        Category old = getById(id);

        String newName = category.getName().trim();

        if (!old.getName().equalsIgnoreCase(newName)
                && categoryRepository.existsByName(newName)) {
            throw new BadRequestException("Tên danh mục đã tồn tại");
        }

        old.setName(newName);
        old.setDescription(category.getDescription());

        return categoryRepository.save(old);
    }

    /* =========================================================
     * XÓA DANH MỤC
     * ---------------------------------------------------------
     * Xử lý:
     * - Tìm danh mục cần xóa theo ID.
     * - Thực hiện xóa danh mục.
     * - Nếu danh mục đang liên kết với sản phẩm, database sẽ
     *   phát sinh lỗi ràng buộc khóa ngoại.
     * - Khi đó hệ thống chuyển thành BadRequestException để
     *   trả thông báo dễ hiểu cho người dùng.
     * ========================================================= */
    @Override
    public void delete(Integer id) {

        Category category = getById(id);

        try {
            categoryRepository.delete(category);
        } catch (DataIntegrityViolationException e) {
            throw new BadRequestException("Không thể xóa danh mục đang có sản phẩm");
        }
    }

    /* =========================================================
     * KIỂM TRA DỮ LIỆU DANH MỤC
     * ---------------------------------------------------------
     * Điều kiện hợp lệ:
     * - Dữ liệu danh mục không được null.
     * - Tên danh mục không được để trống.
     *
     * Hàm này được dùng chung cho thêm mới và cập nhật danh mục.
     * ========================================================= */
    private void validateCategory(Category category) {

        if (category == null) {
            throw new BadRequestException("Dữ liệu danh mục không hợp lệ");
        }

        if (category.getName() == null || category.getName().trim().isEmpty()) {
            throw new BadRequestException("Tên danh mục không được để trống");
        }
    }
}