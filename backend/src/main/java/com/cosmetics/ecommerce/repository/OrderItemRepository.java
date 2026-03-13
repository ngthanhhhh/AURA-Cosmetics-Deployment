package com.cosmetics.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cosmetics.ecommerce.entity.Order;
import com.cosmetics.ecommerce.entity.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer>{
    List<OrderItem> findByOrder(Order order); //demo thoi
}
