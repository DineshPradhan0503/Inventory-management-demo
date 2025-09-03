package com.example.inventory.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

public class AuthDtos {
    @Data
    public static class RegisterRequest {
        @NotBlank
        private String username;
        @Email
        private String email;
        @Size(min = 6)
        private String password;
        private Set<String> roles; // optional; default USER if null
    }

    @Data
    public static class LoginRequest {
        @NotBlank
        private String usernameOrEmail;
        @NotBlank
        private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String username;
        private String email;
        private Set<String> roles;
        private long expiresInMs;
    }
}

