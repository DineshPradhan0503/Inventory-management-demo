package com.example.inventory.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "audit_logs")
public class AuditLog {
    @Id
    private String id;

    private String userId;
    private String action; // e.g., PRODUCT_CREATE, PRODUCT_UPDATE, SALE_RECORD, REPORT_EXPORT
    private String details;
    private Instant timestamp;
}

