package com.example.inventory.service;

import com.example.inventory.model.AuditLog;
import com.example.inventory.repository.AuditLogRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuditService {
    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(String action, String details) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth != null ? auth.getName() : "system";
        AuditLog log = AuditLog.builder()
                .userId(userId)
                .action(action)
                .details(details)
                .timestamp(Instant.now())
                .build();
        auditLogRepository.save(log);
    }
}

