package com.cosmetics.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cosmetics.ecommerce.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>{
    //code o day
    List<Product> findByNameContainingIgnoreCase(String name); //demo
}