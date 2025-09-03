package com.example.inventory.controller;

import com.example.inventory.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ReportController {
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stock")
    public ResponseEntity<Map<String, Object>> stock() {
        return ResponseEntity.ok(reportService.stockReport());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/sales")
    public ResponseEntity<Map<String, Object>> sales(@RequestParam(required = false) String period) {
        return ResponseEntity.ok(reportService.salesSummary(period));
    }
}

