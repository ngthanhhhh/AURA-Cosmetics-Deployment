package com.cosmetics.ecommerce.repository;

import com.cosmetics.ecommerce.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository thao tác dữ liệu khách hàng.
 *
 * Thực chất khách hàng được lưu trong bảng users
 * với role ROLE_CUSTOMER.
 */
@Repository
public interface CustomerRepository extends JpaRepository<User, Integer> {

    /**
     * Lấy danh sách user có ROLE_CUSTOMER.
     *
     * Hỗ trợ tìm kiếm theo tên/email, lọc theo trạng thái
     * và phân trang.
     *
     * @param keyword Từ khóa tìm kiếm.
     * @param isActive Trạng thái hoạt động.
     * @param pageable Thông tin phân trang.
     * @return Danh sách khách hàng.
     */
    @Query("""
    SELECT u FROM User u
    WHERE u.role.roleName = 'ROLE_CUSTOMER'
    AND (:keyword IS NULL 
        OR LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')))
    AND (:isActive IS NULL OR u.isActive = :isActive)
""")
    Page<User> findAllCustomers(@Param("keyword")String keyword, @Param("isActive") Boolean isActive, Pageable pageable);

}
