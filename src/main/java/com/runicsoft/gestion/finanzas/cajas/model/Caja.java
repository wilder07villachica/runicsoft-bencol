package com.runicsoft.gestion.finanzas.cajas.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.runicsoft.gestion.autenticacion.model.Empresa;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "cajas",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_caja_empresa_nombre", columnNames = {"empresa_id", "nombre"})
        },
        indexes = {
                @Index(name = "idx_caja_empresa", columnList = "empresa_id"),
                @Index(name = "idx_caja_activa", columnList = "activa"),
                @Index(name = "idx_caja_principal", columnList = "principal")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Caja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    @JsonIgnore
    private Empresa empresa;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 200)
    private String descripcion;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal saldoActual = BigDecimal.ZERO;

    @Column(nullable = false)
    private Boolean activa = true;

    @Column(nullable = false)
    private Boolean principal = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    public void onCreate() {
        if (this.fechaCreacion == null) {
            this.fechaCreacion = LocalDateTime.now();
        }
        if (this.saldoActual == null) {
            this.saldoActual = BigDecimal.ZERO;
        }
        if (this.activa == null) {
            this.activa = true;
        }
        if (this.principal == null) {
            this.principal = false;
        }
    }
}