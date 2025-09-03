package com.example.inventory.controller;

import com.example.inventory.dto.SaleDtos.RecordSaleRequest;
import com.example.inventory.dto.SaleDtos.SaleResponse;
import com.example.inventory.service.SaleService;
import com.example.inventory.service.AuditService;
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
    private final AuditService auditService;

    public SaleController(SaleService saleService, AuditService auditService) {
        this.saleService = saleService;
        this.auditService = auditService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PostMapping
    public ResponseEntity<SaleResponse> record(@Valid @RequestBody RecordSaleRequest req) {
        SaleResponse res = saleService.record(req);
        auditService.log("SALE_RECORD", res.getId());
        return ResponseEntity.ok(res);
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<SaleResponse>> list() {
        return ResponseEntity.ok(saleService.list());
    }
}

