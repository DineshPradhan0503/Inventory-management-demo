package com.example.inventory.controller;

import com.example.inventory.dto.SaleDtos.RecordSaleRequest;
import com.example.inventory.dto.SaleDtos.SaleResponse;
import com.example.inventory.service.SaleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class SaleController {
    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PostMapping
    public ResponseEntity<SaleResponse> record(@Valid @RequestBody RecordSaleRequest req) {
        return ResponseEntity.ok(saleService.record(req));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<SaleResponse>> list() {
        return ResponseEntity.ok(saleService.list());
    }
}

