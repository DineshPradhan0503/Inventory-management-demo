package com.example.inventory.service;

import com.example.inventory.dto.ProductDtos.CreateOrUpdateProductRequest;
import com.example.inventory.dto.ProductDtos.ProductResponse;
import com.example.inventory.model.Product;
import com.example.inventory.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductResponse create(CreateOrUpdateProductRequest req) {
        Product product = Product.builder()
                .name(req.getName())
                .category(req.getCategory())
                .description(req.getDescription())
                .price(req.getPrice())
                .stockQuantity(req.getStockQuantity())
                .threshold(req.getThreshold())
                .deleted(false)
                .build();
        product = productRepository.save(product);
        return toResponse(product);
    }

    public ProductResponse update(String id, CreateOrUpdateProductRequest req) {
        Product product = productRepository.findById(id).orElseThrow();
        if (req.getName() != null) product.setName(req.getName());
        if (req.getCategory() != null) product.setCategory(req.getCategory());
        if (req.getDescription() != null) product.setDescription(req.getDescription());
        if (req.getPrice() != null) product.setPrice(req.getPrice());
        if (req.getThreshold() >= 0) product.setThreshold(req.getThreshold());
        // stock updates via dedicated methods
        product = productRepository.save(product);
        return toResponse(product);
    }

    public void delete(String id) {
        Product product = productRepository.findById(id).orElseThrow();
        product.setDeleted(true);
        productRepository.save(product);
    }

    public ProductResponse getById(String id) {
        return productRepository.findById(id).map(this::toResponse).orElseThrow();
    }

    public Page<ProductResponse> list(String category, String search, Integer minStock, Integer maxStock, int page, int size) {
        PageRequest pr = PageRequest.of(page, size);
        List<ProductResponse> filtered = productRepository.findAll().stream()
                .filter(p -> !p.isDeleted())
                .filter(p -> category == null || Objects.equals(p.getCategory(), category))
                .filter(p -> search == null || p.getName().toLowerCase().contains(search.toLowerCase()) ||
                        (p.getDescription() != null && p.getDescription().toLowerCase().contains(search.toLowerCase())))
                .filter(p -> minStock == null || p.getStockQuantity() >= minStock)
                .filter(p -> maxStock == null || p.getStockQuantity() <= maxStock)
                .map(this::toResponse)
                .collect(Collectors.toList());
        int start = Math.min((int) pr.getOffset(), filtered.size());
        int end = Math.min((start + pr.getPageSize()), filtered.size());
        return new PageImpl<>(filtered.subList(start, end), pr, filtered.size());
    }

    public ProductResponse increaseStock(String id, int quantity) {
        Product product = productRepository.findById(id).orElseThrow();
        product.setStockQuantity(product.getStockQuantity() + Math.max(0, quantity));
        product = productRepository.save(product);
        return toResponse(product);
    }

    public ProductResponse decreaseStock(String id, int quantity) {
        Product product = productRepository.findById(id).orElseThrow();
        int newQty = product.getStockQuantity() - Math.max(0, quantity);
        if (newQty < 0) {
            throw new IllegalArgumentException("Insufficient stock");
        }
        product.setStockQuantity(newQty);
        product = productRepository.save(product);
        return toResponse(product);
    }

    public void reduceStockOnSale(String productId, int quantity) {
        Product product = productRepository.findById(productId).orElseThrow();
        int newQty = product.getStockQuantity() - quantity;
        if (newQty < 0) {
            throw new IllegalArgumentException("Insufficient stock");
        }
        product.setStockQuantity(newQty);
        productRepository.save(product);
    }

    private ProductResponse toResponse(Product product) {
        ProductResponse res = new ProductResponse();
        res.setId(product.getId());
        res.setName(product.getName());
        res.setCategory(product.getCategory());
        res.setDescription(product.getDescription());
        res.setPrice(product.getPrice());
        res.setStockQuantity(product.getStockQuantity());
        res.setThreshold(product.getThreshold());
        res.setLowStock(product.getStockQuantity() <= product.getThreshold());
        return res;
    }
}

