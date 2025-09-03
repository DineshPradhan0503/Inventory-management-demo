package com.example.inventory.controller;

import com.example.inventory.model.AuditLog;
import com.example.inventory.repository.AuditLogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuditController {
    private final AuditLogRepository auditLogRepository;

    public AuditController(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<AuditLog>> list() {
        return ResponseEntity.ok(auditLogRepository.findAll());
    }
}

