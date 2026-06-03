package com.cosmetics.ecommerce.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/* =========================================================
 * CATEGORY ENTITY
 * ---------------------------------------------------------
 * Đại diện cho bảng categories trong cơ sở dữ liệu.
 *
 * Chức năng:
 * - Lưu thông tin danh mục sản phẩm.
 * - Phục vụ phân loại sản phẩm theo từng nhóm.
 * - Hỗ trợ quản lý danh mục trong khu vực quản trị.
 * ========================================================= */
@Entity
@Table(name = "categories")
@Data
public class Category {

    /* =========================================================
     * KHÓA CHÍNH DANH MỤC
     * ---------------------------------------------------------
     * categoryId được sinh tự động bởi MySQL theo cơ chế
     * AUTO_INCREMENT.
     * ========================================================= */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;

    /* =========================================================
     * TÊN DANH MỤC
     * ---------------------------------------------------------
     * - Bắt buộc nhập.
     * - Không được trùng lặp.
     * - Tối đa 100 ký tự.
     * ========================================================= */
    @NotBlank(message = "Tên danh mục không được để trống")
    @Size(max = 100, message = "Tên không được vượt quá 100 ký tự")
    @Column(nullable = false, unique = true, length = 100)
    private String name;

    /* =========================================================
     * MÔ TẢ DANH MỤC
     * ---------------------------------------------------------
     * Lưu thông tin mô tả chi tiết cho danh mục.
     * Dữ liệu được lưu dưới dạng TEXT trong database.
     * ========================================================= */
    @Size(max = 500, message = "Mô tả không quá 500 ký tự")
    @Column(columnDefinition = "TEXT")
    private String description;

    /* =========================================================
     * THỜI GIAN TẠO DANH MỤC
     * ---------------------------------------------------------
     * Được thiết lập khi thêm mới dữ liệu.
     * Không cho phép cập nhật lại sau khi tạo.
     * ========================================================= */
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /* =========================================================
     * THỜI GIAN CẬP NHẬT GẦN NHẤT
     * ---------------------------------------------------------
     * Được cập nhật mỗi khi chỉnh sửa thông tin danh mục.
     * ========================================================= */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /* =========================================================
     * XỬ LÝ TRƯỚC KHI THÊM MỚI DỮ LIỆU
     * ---------------------------------------------------------
     * - Loại bỏ khoảng trắng thừa ở đầu và cuối tên danh mục.
     * - Gán thời gian tạo và cập nhật ban đầu.
     * ========================================================= */
    @PrePersist
    public void prePersist() {
        if (name != null) name = name.trim();
        createdAt = updatedAt = LocalDateTime.now();
    }

    /* =========================================================
     * XỬ LÝ TRƯỚC KHI CẬP NHẬT DỮ LIỆU
     * ---------------------------------------------------------
     * - Loại bỏ khoảng trắng thừa ở đầu và cuối tên danh mục.
     * - Cập nhật lại thời gian chỉnh sửa gần nhất.
     * ========================================================= */
    @PreUpdate
    public void preUpdate() {
        if (name != null) name = name.trim();
        updatedAt = LocalDateTime.now();
    }
}