package com.cosmetics.ecommerce.service.impl;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.cosmetics.ecommerce.entity.Category;
import com.cosmetics.ecommerce.repository.CategoryRepository;
import com.cosmetics.ecommerce.service.CategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    // 1. GET ALL
    @Override
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    // 2. GET BY ID
    @Override
    public Category getById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CATEGORY_NOT_FOUND"));
    }

    // 3. CREATE
    @Override
    public Category create(Category category) {

        // null guard (phòng trường hợp FE gửi thiếu)
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            throw new RuntimeException("CATEGORY_NAME_REQUIRED");
        }

        // check trùng
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("CATEGORY_NAME_EXISTS");
        }

        return categoryRepository.save(category);
    }

    // 4. UPDATE
    @Override
    public Category update(Integer id, Category category) {

        Category old = getById(id);

        if (category.getName() == null || category.getName().trim().isEmpty()) {
            throw new RuntimeException("CATEGORY_NAME_REQUIRED");
        }

        // check trùng (trừ chính nó)
        if (!old.getName().equals(category.getName())
                && categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("CATEGORY_NAME_EXISTS");
        }

        old.setName(category.getName());
        old.setDescription(category.getDescription());

        return categoryRepository.save(old);
    }

    // 5. DELETE
    @Override
    public void delete(Integer id) {

        Category category = getById(id);

        try {
            categoryRepository.delete(category);
        } catch (DataIntegrityViolationException e) {
            // FK constraint (có product)
            throw new RuntimeException("CATEGORY_HAS_PRODUCTS");
        }
    }
}