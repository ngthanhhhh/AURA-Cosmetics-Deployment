package com.cosmetics.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import com.cosmetics.ecommerce.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cosmetics.ecommerce.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    //tim user theo email, dung khi dang nhap
    Optional<User> findByEmail(String email);

    //kiem tra email da ton tai chua, dung khi dang ky
    boolean existsByEmail(String email);

    //lấy danh sách user theo role (dùng cho quản lý tài khoản admin)
    List<User> findByRole(Role role);

    //Lấy danh sách user theo role và chỉ lấy tài khoản còn hoạt động (không bị xóa mềm)
    List<User> findByRoleAndIsActiveTrue(Role role);

    //Kiểm tra email tồn tại nhưng khác id hiện tại
    boolean existsByEmailAndUserIdNot(String email, Integer userId);
}
