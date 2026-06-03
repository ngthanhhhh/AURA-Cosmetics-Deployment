package com.cosmetics.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import com.cosmetics.ecommerce.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import com.cosmetics.ecommerce.entity.User;
/**
 * Repository thao tác dữ liệu tài khoản người dùng.
 *
 * Được sử dụng cho:
 * - Auth
 * - User profile
 * - Admin account management
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndUserIdNot(String email, Integer userId);

    /**
     * Tìm kiếm và lọc danh sách tài khoản quản trị.
     *
     * Hỗ trợ:
     * - Tìm kiếm theo tên hoặc email
     * - Lọc theo trạng thái hoạt động
     * - Phân trang kết quả
     */
    @Query("""
    SELECT u FROM User u
    WHERE u.role.roleName = 'ROLE_ADMIN'
    AND (:keyword IS NULL 
        OR LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')))
    AND (:isActive IS NULL OR u.isActive = :isActive)
""")

    Page<User> findAdmins(
            @Param("keyword") String keyword,
            @Param("isActive") Boolean isActive,
            Pageable pageable
    );
}
