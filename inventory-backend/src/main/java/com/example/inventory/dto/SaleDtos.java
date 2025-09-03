package com.example.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.Instant;

public class SaleDtos {
    @Data
    public static class RecordSaleRequest {
        @NotBlank
        private String productId;
        @Min(1)
        private int quantity;
    }

    @Data
    public static class SaleResponse {
        private String id;
        private String productId;
        private int quantity;
        private Instant saleTime;
        private String soldByUserId;
    }
}

