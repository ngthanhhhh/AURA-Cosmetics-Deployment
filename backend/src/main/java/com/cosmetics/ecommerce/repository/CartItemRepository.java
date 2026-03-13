package com.cosmetics.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cosmetics.ecommerce.entity.Cart;
import com.cosmetics.ecommerce.entity.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer>{
    List<CartItem> findByCart(Cart cart);//demo
    
}