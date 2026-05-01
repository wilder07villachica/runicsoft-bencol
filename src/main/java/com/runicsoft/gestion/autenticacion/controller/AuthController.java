package com.runicsoft.gestion.autenticacion.controller;

import com.runicsoft.gestion.autenticacion.dtos.request.ForgotPasswordRequest;
import com.runicsoft.gestion.autenticacion.dtos.request.LoginRequest;
import com.runicsoft.gestion.autenticacion.dtos.request.RegisterRequest;
import com.runicsoft.gestion.autenticacion.dtos.request.ResetPasswordRequest;
import com.runicsoft.gestion.autenticacion.dtos.response.AuthResponse;
import com.runicsoft.gestion.autenticacion.dtos.response.AvailabilityResponse;
import com.runicsoft.gestion.autenticacion.dtos.response.MessageResponse;
import com.runicsoft.gestion.autenticacion.dtos.response.UsuarioResponse;
import com.runicsoft.gestion.autenticacion.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class AuthController {
    private final AuthService authService;

    @GetMapping("/check-correo")
    public ResponseEntity<AvailabilityResponse> checkCorreo(@RequestParam String correo) {
        return ResponseEntity.ok(authService.correoDisponible(correo));
    }

    @GetMapping("/check-celular")
    public ResponseEntity<AvailabilityResponse> checkCelular(@RequestParam String celular) {
        return ResponseEntity.ok(authService.celularDisponible(celular));
    }

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(@RequestParam String token) {
        return ResponseEntity.ok(authService.verifyEmail(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        return ResponseEntity.ok(authService.login(request, httpRequest));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> me(Authentication authentication) {
        return ResponseEntity.ok(authService.me(authentication.getName()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }
}
