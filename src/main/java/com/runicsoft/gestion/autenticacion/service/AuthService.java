package com.runicsoft.gestion.autenticacion.service;

import com.runicsoft.gestion.autenticacion.dtos.request.ForgotPasswordRequest;
import com.runicsoft.gestion.autenticacion.dtos.request.LoginRequest;
import com.runicsoft.gestion.autenticacion.dtos.request.RegisterRequest;
import com.runicsoft.gestion.autenticacion.dtos.request.ResetPasswordRequest;
import com.runicsoft.gestion.autenticacion.dtos.response.AuthResponse;
import com.runicsoft.gestion.autenticacion.dtos.response.AvailabilityResponse;
import com.runicsoft.gestion.autenticacion.dtos.response.MessageResponse;
import com.runicsoft.gestion.autenticacion.dtos.response.UsuarioResponse;
import com.runicsoft.gestion.autenticacion.model.*;
import com.runicsoft.gestion.autenticacion.repository.*;
import com.runicsoft.gestion.autenticacion.security.JwtService;
import com.runicsoft.gestion.finanzas.cajas.model.Caja;
import com.runicsoft.gestion.finanzas.cajas.repository.CajaRepository;
import com.runicsoft.gestion.utils.EstadoUsuario;
import com.runicsoft.gestion.utils.RolUsuario;
import com.runicsoft.gestion.utils.TipoToken;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final CajaRepository cajaRepository;
    private final RolRepository rolRepository;
    private final UsuarioTokenRepository tokenRepository;
    private final SesionUsuarioRepository sesionRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional(readOnly = true)
    public AvailabilityResponse correoDisponible(String correo) {
        return new AvailabilityResponse(!usuarioRepository.existsByCorreo(normalizarCorreo(correo)));
    }

    @Transactional(readOnly = true)
    public AvailabilityResponse celularDisponible(String celular) {
        return new AvailabilityResponse(!usuarioRepository.existsByCelular(celular.trim()));
    }

    @Transactional
    public MessageResponse register(RegisterRequest request) {
        String correo = normalizarCorreo(request.getCorreo());
        String celular = request.getCelular().trim();

        if (usuarioRepository.existsByCorreo(correo)) {
            throw new IllegalArgumentException("El correo ya está registrado.");
        }

        if (usuarioRepository.existsByCelular(celular)) {
            throw new IllegalArgumentException("El celular ya está registrado.");
        }

        Rol rol = rolRepository.findByNombre(RolUsuario.ADMIN_EMPRESA)
                .orElseThrow(() -> new IllegalArgumentException("No existe el rol ADMIN_EMPRESA. Ejecuta el script SQL de roles."));

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre().trim());
        usuario.setCorreo(correo);
        usuario.setCelular(celular);
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(rol);
        usuario.setEstado(EstadoUsuario.PENDIENTE_VERIFICACION);
        usuario.setEmailVerificado(false);
        usuarioRepository.save(usuario);

        crearCajaPrincipalPorDefectoSiNoExiste();

        UsuarioToken token = crearToken(usuario, TipoToken.VERIFICACION_EMAIL, 24);

        System.out.println("========================================");
        System.out.println("TOKEN VERIFICACION EMAIL: " + token.getToken());
        System.out.println("URL: http://localhost:5173/verificar-correo?token=" + token.getToken());
        System.out.println("========================================");

        return new MessageResponse("Registro creado. Verifica tu correo para activar la cuenta.");
    }

    @Transactional
    public MessageResponse verifyEmail(String tokenValue) {
        UsuarioToken token = tokenRepository.findByTokenAndTipo(tokenValue, TipoToken.VERIFICACION_EMAIL)
                .orElseThrow(() -> new IllegalArgumentException("Token inválido."));

        validarToken(token);

        Usuario usuario = token.getUsuario();
        usuario.setEmailVerificado(true);
        usuario.setEstado(EstadoUsuario.ACTIVO);
        usuario.setFechaActualizacion(LocalDateTime.now());

        token.setUsado(true);

        usuarioRepository.save(usuario);
        tokenRepository.save(token);

        return new MessageResponse("Correo verificado correctamente. Ya puedes iniciar sesión.");
    }

    @Transactional
    public AuthResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        String correo = normalizarCorreo(request.getCorreo());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(correo, request.getPassword())
        );

        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas."));

        if (!Boolean.TRUE.equals(usuario.getEmailVerificado())) {
            throw new IllegalArgumentException("Debes verificar tu correo antes de iniciar sesión.");
        }

        if (usuario.getEstado() != EstadoUsuario.ACTIVO) {
            throw new IllegalArgumentException("El usuario no está activo.");
        }

        crearCajaPrincipalPorDefectoSiNoExiste();

        String jti = UUID.randomUUID().toString();
        String jwt = jwtService.generateToken(usuario, jti);

        SesionUsuario sesion = new SesionUsuario();
        sesion.setUsuario(usuario);
        sesion.setTokenJti(jti);
        sesion.setIp(httpRequest.getRemoteAddr());
        sesion.setUserAgent(httpRequest.getHeader("User-Agent"));
        sesion.setFechaExpiracion(LocalDateTime.now().plusMinutes(jwtService.getExpirationMinutes()));
        sesion.setUltimaActividad(LocalDateTime.now());
        sesionRepository.save(sesion);

        usuario.setUltimoLogin(LocalDateTime.now());
        usuarioRepository.save(usuario);

        return new AuthResponse(jwt, "Bearer", toResponse(usuario));
    }

    @Transactional(readOnly = true)
    public UsuarioResponse me(String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(normalizarCorreo(correo))
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));

        return toResponse(usuario);
    }

    @Transactional
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        String correo = normalizarCorreo(request.getCorreo());

        usuarioRepository.findByCorreo(correo).ifPresent(usuario -> {
            tokenRepository.deleteByUsuarioAndTipo(usuario, TipoToken.RECUPERACION_PASSWORD);

            UsuarioToken token = crearToken(usuario, TipoToken.RECUPERACION_PASSWORD, 1);

            System.out.println("========================================");
            System.out.println("TOKEN RECUPERACION PASSWORD: " + token.getToken());
            System.out.println("URL: http://localhost:5173/restablecer-password?token=" + token.getToken());
            System.out.println("========================================");
        });

        return new MessageResponse("Si el correo existe, se enviaron instrucciones de recuperación.");
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        UsuarioToken token = tokenRepository.findByTokenAndTipo(request.getToken(), TipoToken.RECUPERACION_PASSWORD)
                .orElseThrow(() -> new IllegalArgumentException("Token inválido."));

        validarToken(token);

        Usuario usuario = token.getUsuario();
        usuario.setPasswordHash(passwordEncoder.encode(request.getNuevaPassword()));
        usuario.setFechaActualizacion(LocalDateTime.now());

        token.setUsado(true);

        usuarioRepository.save(usuario);
        tokenRepository.save(token);

        return new MessageResponse("Contraseña actualizada correctamente.");
    }

    private UsuarioToken crearToken(Usuario usuario, TipoToken tipo, int horas) {
        UsuarioToken token = new UsuarioToken();
        token.setUsuario(usuario);
        token.setTipo(tipo);
        token.setToken(UUID.randomUUID().toString().replace("-", ""));
        token.setFechaExpiracion(LocalDateTime.now().plusHours(horas));

        return tokenRepository.save(token);
    }

    private void validarToken(UsuarioToken token) {
        if (Boolean.TRUE.equals(token.getUsado())) {
            throw new IllegalArgumentException("El token ya fue usado.");
        }

        if (token.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("El token expiró.");
        }
    }

    private String normalizarCorreo(String correo) {
        return correo == null ? "" : correo.trim().toLowerCase();
    }

    private void crearCajaPrincipalPorDefectoSiNoExiste() {
        if (cajaRepository.findByPrincipalTrue().isPresent()) {
            return;
        }

        Caja caja = new Caja();
        caja.setNombre("Caja principal");
        caja.setDescripcion("Pendiente de configurar");
        caja.setSaldoActual(BigDecimal.ZERO);
        caja.setActiva(true);
        caja.setPrincipal(true);

        cajaRepository.save(caja);
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return UsuarioResponse.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .correo(usuario.getCorreo())
                .celular(usuario.getCelular())
                .rol(usuario.getRol().getNombre().name())
                .estado(usuario.getEstado().name())
                .emailVerificado(usuario.getEmailVerificado())
                .build();
    }
}