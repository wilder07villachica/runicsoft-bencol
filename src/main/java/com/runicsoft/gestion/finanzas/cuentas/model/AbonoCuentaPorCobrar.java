package com.runicsoft.gestion.finanzas.cuentas.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.runicsoft.gestion.autenticacion.model.Empresa;
import com.runicsoft.gestion.finanzas.cajas.model.Caja;
import com.runicsoft.gestion.utils.MetodoPago;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "abonos_cuentas_por_cobrar",
        indexes = {
                @Index(name = "idx_abono_empresa", columnList = "empresa_id"),
                @Index(name = "idx_abono_cuenta", columnList = "cuenta_por_cobrar_id"),
                @Index(name = "idx_abono_caja", columnList = "caja_id")
        }
)
@Data
public class AbonoCuentaPorCobrar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    @JsonIgnore
    private Empresa empresa;

    @ManyToOne(optional = false)
    @JoinColumn(name = "cuenta_por_cobrar_id", nullable = false)
    private CuentaPorCobrar cuentaPorCobrar;

    @ManyToOne(optional = false)
    @JoinColumn(name = "caja_id", nullable = false)
    private Caja caja;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal monto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MetodoPago metodoPago;

    @Column(length = 200)
    private String referencia;

    @Column(length = 300)
    private String observacion;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @PrePersist
    public void onCreate() {
        this.fecha = LocalDateTime.now();
    }
}