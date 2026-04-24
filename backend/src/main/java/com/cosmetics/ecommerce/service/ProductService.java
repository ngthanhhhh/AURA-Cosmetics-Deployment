package com.cosmetics.ecommerce.service;

import java.math.BigDecimal;
import java.util.List;

import com.cosmetics.ecommerce.entity.Product;

public interface ProductService {
    List<Product> getAll();
    Product getById(Integer id);
    Product create(Product product);
    Product update(Integer id, Product product);
    void delete(Integer id);

    List<Product> search(String name, BigDecimal min, BigDecimal max, Integer categoryId);
    List<Product> searchAdvanced(String name, Integer categoryId, Double minPrice, Double maxPrice);
}