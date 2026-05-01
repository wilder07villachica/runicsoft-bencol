package com.runicsoft.gestion.autenticacion.security;

import com.runicsoft.gestion.autenticacion.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-minutes}")
    private long expirationMinutes;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Usuario usuario, String jti) {
        Instant now = Instant.now();
        return Jwts.builder()
                .id(jti == null ? UUID.randomUUID().toString() : jti)
                .subject(usuario.getCorreo())
                .claims(Map.of(
                        "uid", usuario.getId(),
                        "rol", usuario.getRol().getNombre().name(),
                        "nombre", usuario.getNombre()
                ))
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(expirationMinutes * 60)))
                .signWith(key())
                .compact();
    }

    public Claims getClaims(String token) {
        return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload();
    }

    public String getCorreo(String token) {
        return getClaims(token).getSubject();
    }

    public String getJti(String token) {
        return getClaims(token).getId();
    }

    public long getExpirationMinutes() {
        return expirationMinutes;
    }
}
