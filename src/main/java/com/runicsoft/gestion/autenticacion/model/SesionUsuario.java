package com.runicsoft.gestion.autenticacion.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "sesiones_usuario")
@Data
public class SesionUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "token_jti", nullable = false, unique = true, length = 120)
    private String tokenJti;

    private String ip;

    @Column(name = "user_agent")
    private String userAgent;

    private Boolean activa = true;

    @Column(name = "fecha_inicio")
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_expiracion", nullable = false)
    private LocalDateTime fechaExpiracion;

    @Column(name = "fecha_cierre")
    private LocalDateTime fechaCierre;

    @Column(name = "ultima_actividad")
    private LocalDateTime ultimaActividad;

    @PrePersist
    public void prePersist() {
        this.fechaInicio = LocalDateTime.now();
    }
}
