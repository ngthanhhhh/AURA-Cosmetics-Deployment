package com.cosmetics.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cosmetics.ecommerce.entity.Order;
import com.cosmetics.ecommerce.entity.User;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer>{
    List<Order> findByUserOrderByCreatedAtDesc(User user); //demo thoi 
}