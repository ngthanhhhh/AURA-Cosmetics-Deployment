package com.cosmetics.ecommerce.service;

import java.util.List;

import com.cosmetics.ecommerce.entity.Category;

public interface CategoryService {

    List<Category> getAll();

    Category getById(Integer id);

    Category create(Category category);

    Category update(Integer id, Category category);

    void delete(Integer id);
}