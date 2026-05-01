package com.cosmetics.ecommerce.repository;

import com.cosmetics.ecommerce.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<User, Integer> {

    //Lọc user có role CUSTOMER và hỗ trợ tìm kiếm theo tên/email
    @Query("SELECT u FROM User u WHERE u.role.roleName = 'CUSTOMER' AND " +
            "(:keyword IS NULL OR u.name LIKE %:keyword% OR u.email LIKE %:keyword%)")
    Page<User> findAllCustomers(@Param("keyword") String keyword, Pageable pageable);
}
