package com.cosmetics.ecommerce.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.cosmetics.ecommerce.enums.ProductStatus;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

/* =========================================================
 * PRODUCT ENTITY
 * ---------------------------------------------------------
 * Đại diện cho bảng products trong cơ sở dữ liệu.
 *
 * Chức năng:
 * - Lưu trữ thông tin sản phẩm mỹ phẩm.
 * - Liên kết với danh mục sản phẩm.
 * - Quản lý giá bán, tồn kho, hình ảnh và trạng thái kinh doanh.
 * - Phục vụ các chức năng tìm kiếm, lọc, đặt hàng và quản trị.
 * ========================================================= */
@Entity
@Table(name = "products")
@Data
public class Product {

    /* =========================================================
     * KHÓA CHÍNH SẢN PHẨM
     * ---------------------------------------------------------
     * productId được sinh tự động bởi MySQL theo cơ chế
     * AUTO_INCREMENT.
     * ========================================================= */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;

    /* =========================================================
     * TÊN SẢN PHẨM
     * ---------------------------------------------------------
     * - Bắt buộc nhập.
     * - Giới hạn tối đa 150 ký tự.
     * ========================================================= */
    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 150, message = "Tên không quá 150 ký tự")
    private String name;

    /* =========================================================
     * GIÁ BÁN SẢN PHẨM
     * ---------------------------------------------------------
     * - Không được để trống.
     * - Giá trị phải lớn hơn 0.
     * Sử dụng BigDecimal để đảm bảo độ chính xác khi xử lý tiền.
     * ========================================================= */
    @NotNull(message = "Giá không được null")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá phải > 0")
    private BigDecimal price;

    /* =========================================================
     * SỐ LƯỢNG TỒN KHO
     * ---------------------------------------------------------
     * Theo dõi số lượng sản phẩm còn lại trong kho.
     * Giá trị mặc định là 0.
     * ========================================================= */
    @NotNull(message = "Stock không được null")
    @Min(value = 0, message = "Stock phải >= 0")
    private Integer stock = 0;

    /* =========================================================
     * MÔ TẢ SẢN PHẨM
     * ---------------------------------------------------------
     * Lưu thông tin chi tiết giúp khách hàng hiểu rõ hơn về
     * công dụng và đặc điểm của sản phẩm.
     * ========================================================= */
    @Size(max = 1000, message = "Mô tả không quá 1000 ký tự")
    private String description;

    /* =========================================================
     * HÌNH ẢNH SẢN PHẨM
     * ---------------------------------------------------------
     * Lưu URL hình ảnh sản phẩm.
     * Trong hệ thống hiện tại, ảnh được upload và lưu trữ
     * trên Cloudinary.
     * ========================================================= */
    @Size(max = 255, message = "URL ảnh không quá 255 ký tự")
    private String image;

    /* =========================================================
     * TRẠNG THÁI KINH DOANH
     * ---------------------------------------------------------
     * ACTIVE   : Đang kinh doanh.
     * INACTIVE : Ngừng kinh doanh.
     *
     * Khách hàng chỉ được xem các sản phẩm có trạng thái ACTIVE.
     * ========================================================= */
    @Enumerated(EnumType.STRING)
    private ProductStatus status = ProductStatus.ACTIVE;

    /* =========================================================
     * DANH MỤC SẢN PHẨM
     * ---------------------------------------------------------
     * Quan hệ nhiều sản phẩm thuộc một danh mục.
     * Mỗi sản phẩm bắt buộc phải thuộc một danh mục.
     * ========================================================= */
    @NotNull(message = "Category không được null")
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    /* =========================================================
     * THỜI GIAN TẠO VÀ CẬP NHẬT DỮ LIỆU
     * ---------------------------------------------------------
     * createdAt : Thời điểm tạo sản phẩm.
     * updatedAt : Thời điểm cập nhật gần nhất.
     * ========================================================= */
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /* =========================================================
     * XỬ LÝ TRƯỚC KHI THÊM MỚI DỮ LIỆU
     * ---------------------------------------------------------
     * - Loại bỏ khoảng trắng thừa ở tên sản phẩm.
     * - Gán trạng thái mặc định là ACTIVE nếu chưa có giá trị.
     * - Thiết lập thời gian tạo và cập nhật ban đầu.
     * ========================================================= */
    @PrePersist
    public void prePersist() {
        if (name != null) name = name.trim();
        if (status == null) status = ProductStatus.ACTIVE;
        createdAt = updatedAt = LocalDateTime.now();
    }

    /* =========================================================
     * XỬ LÝ TRƯỚC KHI CẬP NHẬT DỮ LIỆU
     * ---------------------------------------------------------
     * - Loại bỏ khoảng trắng thừa ở tên sản phẩm.
     * - Cập nhật lại thời gian chỉnh sửa gần nhất.
     * ========================================================= */
    @PreUpdate
    public void preUpdate() {
        if (name != null) name = name.trim();
        updatedAt = LocalDateTime.now();
    }
}