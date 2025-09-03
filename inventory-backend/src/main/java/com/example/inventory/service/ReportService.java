package com.example.inventory.service;

import com.example.inventory.model.Product;
import com.example.inventory.model.Sale;
import com.example.inventory.repository.ProductRepository;
import com.example.inventory.repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {
    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;

    public ReportService(ProductRepository productRepository, SaleRepository saleRepository) {
        this.productRepository = productRepository;
        this.saleRepository = saleRepository;
    }

    public Map<String, Object> stockReport() {
        List<Product> products = productRepository.findAll();
        int totalItems = products.stream().mapToInt(Product::getStockQuantity).sum();
        BigDecimal stockValue = products.stream()
                .map(p -> p.getPrice().multiply(BigDecimal.valueOf(p.getStockQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        List<Map<String, Object>> lowStock = products.stream()
                .filter(p -> p.getStockQuantity() <= p.getThreshold())
                .map(p -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", p.getId());
                    m.put("name", p.getName());
                    m.put("stockQuantity", p.getStockQuantity());
                    m.put("threshold", p.getThreshold());
                    return m;
                })
                .collect(Collectors.toList());
        Map<String, Object> result = new HashMap<>();
        result.put("totalItems", totalItems);
        result.put("stockValue", stockValue);
        result.put("lowStock", lowStock);
        return result;
    }

    public Map<String, Object> salesSummary(String period) {
        Instant now = Instant.now();
        Instant from = switch (period == null ? "daily" : period) {
            case "weekly" -> now.minus(7, ChronoUnit.DAYS);
            case "monthly" -> now.minus(30, ChronoUnit.DAYS);
            default -> now.minus(1, ChronoUnit.DAYS);
        };
        List<Sale> sales = saleRepository.findAll().stream()
                .filter(s -> s.getSaleTime().isAfter(from))
                .collect(Collectors.toList());
        Map<String, Long> productTotals = sales.stream()
                .collect(Collectors.groupingBy(Sale::getProductId, Collectors.summingLong(Sale::getQuantity)));
        String bestProductId = productTotals.entrySet().stream()
                .max(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse(null);
        Map<String, Object> result = new HashMap<>();
        result.put("totalSalesCount", sales.size());
        result.put("totalUnitsSold", sales.stream().mapToInt(Sale::getQuantity).sum());
        result.put("bestProductId", bestProductId);
        result.put("productTotals", productTotals);
        return result;
    }
}

