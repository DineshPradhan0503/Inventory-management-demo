package com.example.inventory.controller;

import com.example.inventory.dto.ProductDtos.CreateOrUpdateProductRequest;
import com.example.inventory.dto.ProductDtos.ProductResponse;
import com.example.inventory.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer minStock,
            @RequestParam(required = false) Integer maxStock,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(productService.list(category, search, minStock, maxStock, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> get(@PathVariable String id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody CreateOrUpdateProductRequest req) {
        return ResponseEntity.ok(productService.create(req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(@PathVariable String id, @Valid @RequestBody CreateOrUpdateProductRequest req) {
        return ResponseEntity.ok(productService.update(id, req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/increase")
    public ResponseEntity<ProductResponse> increase(@PathVariable String id, @RequestParam int qty) {
        return ResponseEntity.ok(productService.increaseStock(id, qty));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/decrease")
    public ResponseEntity<ProductResponse> decrease(@PathVariable String id, @RequestParam int qty) {
        return ResponseEntity.ok(productService.decreaseStock(id, qty));
    }
}

