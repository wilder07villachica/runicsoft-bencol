package com.runicsoft.gestion.autenticacion.model;

import com.runicsoft.gestion.utils.Estado;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "empresas")
@Data
public class Empresa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "razon_social", nullable = false, length = 250)
    private String razonSocial;

    @Column(name = "nombre_comercial", nullable = false, length = 250)
    private String nombreComercial;

    @Column(length = 20, unique = true)
    private String ruc;

    @Column(length = 250)
    private String correo;

    @Column(length = 20)
    private String telefono;

    @Column(length = 250)
    private String direccion;

    @Enumerated(EnumType.STRING)
    private Estado estado = Estado.ACTIVO;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @PrePersist
    public void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }
}
