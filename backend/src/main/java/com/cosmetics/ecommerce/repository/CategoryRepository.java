package com.cosmetics.ecommerce.repository;

import com.cosmetics.ecommerce.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    boolean existsByName(String name);

    Page<Category> findByNameContainingIgnoreCase(String keyword, Pageable pageable);
}