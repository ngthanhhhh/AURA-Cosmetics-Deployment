package com.cosmetics.ecommerce.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cosmetics.ecommerce.entity.Order;
import com.cosmetics.ecommerce.enums.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer>{
    List<Order> findByUser_UserIdOrderByCreatedAtDesc(Integer userId);

    //Tìm kiếm theo tên/sđt; lọc theo trạng thái
    @Query("SELECT o FROM Order o WHERE " +
        "(:status IS NULL OR o.status = :status) AND " +
        "(:keyword IS NULL OR LOWER(o.recipientName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
        "OR o.recipientPhone LIKE CONCAT('%', :keyword, '%'))")
    Page<Order> searchAdminOrders(@Param("status") OrderStatus status,
                                @Param("keyword") String keyword,
                                Pageable pageable);
}