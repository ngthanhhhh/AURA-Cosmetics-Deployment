package com.cosmetics.ecommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cosmetics.ecommerce.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer>{

    /**
     * Tìm role theo tên role.
     *
     * Dùng khi đăng ký user mới hoặc tạo tài khoản admin.
     *
     * @param roleName Tên role, ví dụ ROLE_CUSTOMER hoặc ROLE_ADMIN.
     * @return Role tương ứng nếu tồn tại.
     */
    Optional<Role> findByRoleName(String roleName);
}