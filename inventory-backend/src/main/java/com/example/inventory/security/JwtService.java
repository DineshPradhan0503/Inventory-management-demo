package com.example.inventory.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;
import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

@Service
public class JwtService {
    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    @Value("${app.jwt.issuer}")
    private String issuer;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(String subject, Map<String, Object> extraClaims) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(subject)
                .setIssuer(issuer)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, String username) {
        final String subject = extractUsername(token);
        return subject.equals(username) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = decodeSecretSafely(jwtSecret);
        if (keyBytes.length < 32) {
            // Ensure minimum length for HS256 (256 bits). Pad deterministically.
            byte[] padded = new byte[32];
            for (int i = 0; i < 32; i++) {
                padded[i] = keyBytes[i % keyBytes.length];
            }
            keyBytes = padded;
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private static final Pattern BASE64_PATTERN = Pattern.compile("^[A-Za-z0-9+/=\\s]+$");
    private static final Pattern BASE64URL_PATTERN = Pattern.compile("^[A-Za-z0-9_-]+={0,2}$");

    private byte[] decodeSecretSafely(String secret) {
        if (secret == null) {
            return new byte[0];
        }
        String trimmed = secret.trim();
        // Heuristic: choose decoder based on allowed character sets to avoid throwing
        if (BASE64_PATTERN.matcher(trimmed).matches()) {
            try { return Decoders.BASE64.decode(trimmed); } catch (RuntimeException ignore) {}
        }
        if (BASE64URL_PATTERN.matcher(trimmed).matches()) {
            try { return Decoders.BASE64URL.decode(trimmed); } catch (RuntimeException ignore) {}
        }
        return trimmed.getBytes(StandardCharsets.UTF_8);
    }
}

