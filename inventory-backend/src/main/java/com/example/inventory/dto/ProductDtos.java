package com.example.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

public class ProductDtos {
    @Data
    public static class CreateOrUpdateProductRequest {
        @NotBlank
        private String name;
        private String category;
        private String description;
        @NotNull
        @Min(0)
        private BigDecimal price;
        @Min(0)
        private int stockQuantity;
        @Min(0)
        private int threshold;
    }

    @Data
    public static class ProductResponse {
        private String id;
        private String name;
        private String category;
        private String description;
        private BigDecimal price;
        private int stockQuantity;
        private int threshold;
        private boolean lowStock;
    }
}

