package com.example.inventory.controller;

import com.example.inventory.service.ReportService;
import com.example.inventory.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ReportController {
    private final ReportService reportService;
    private final AuditService auditService;

    public ReportController(ReportService reportService, AuditService auditService) {
        this.reportService = reportService;
        this.auditService = auditService;
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

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(value = "/stock.xlsx", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public @ResponseBody byte[] exportStockExcel() {
        auditService.log("REPORT_EXPORT", "stock.xlsx");
        return reportService.stockReportExcel();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(value = "/sales.xlsx", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public @ResponseBody byte[] exportSalesExcel(@RequestParam(required = false) String period) {
        auditService.log("REPORT_EXPORT", "sales.xlsx:" + (period == null ? "daily" : period));
        return reportService.salesSummaryExcel(period);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(value = "/stock.pdf", produces = "application/pdf")
    public @ResponseBody byte[] exportStockPdf() {
        auditService.log("REPORT_EXPORT", "stock.pdf");
        return reportService.stockReportPdf();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(value = "/sales.pdf", produces = "application/pdf")
    public @ResponseBody byte[] exportSalesPdf(@RequestParam(required = false) String period) {
        auditService.log("REPORT_EXPORT", "sales.pdf:" + (period == null ? "daily" : period));
        return reportService.salesSummaryPdf(period);
    }
}

