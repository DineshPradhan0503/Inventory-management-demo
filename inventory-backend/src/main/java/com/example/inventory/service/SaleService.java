package com.example.inventory.service;

import com.example.inventory.dto.SaleDtos.RecordSaleRequest;
import com.example.inventory.dto.SaleDtos.SaleResponse;
import com.example.inventory.model.Sale;
import com.example.inventory.repository.SaleRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SaleService {
    private final SaleRepository saleRepository;
    private final ProductService productService;

    public SaleService(SaleRepository saleRepository, ProductService productService) {
        this.saleRepository = saleRepository;
        this.productService = productService;
    }

    public SaleResponse record(RecordSaleRequest req) {
        productService.reduceStockOnSale(req.getProductId(), req.getQuantity());
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth != null ? auth.getName() : "unknown";
        Sale sale = Sale.builder()
                .productId(req.getProductId())
                .quantity(req.getQuantity())
                .saleTime(Instant.now())
                .soldByUserId(username)
                .build();
        sale = saleRepository.save(sale);
        return toResponse(sale);
    }

    public List<SaleResponse> list() {
        return saleRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    private SaleResponse toResponse(Sale sale) {
        SaleResponse res = new SaleResponse();
        res.setId(sale.getId());
        res.setProductId(sale.getProductId());
        res.setQuantity(sale.getQuantity());
        res.setSaleTime(sale.getSaleTime());
        res.setSoldByUserId(sale.getSoldByUserId());
        return res;
    }
}

