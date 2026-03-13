package com.cosmetics.ecommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cosmetics.ecommerce.entity.Cart;
import com.cosmetics.ecommerce.entity.User;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer>{
    Optional<Cart> findByUser(User user); //demo    
}