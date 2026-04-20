package com.runicsoft.gestion.finanzas.cuentas.model;

import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.finanzas.shared.EstadoCuentaCobrar;
import com.runicsoft.gestion.ventas.model.Venta;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "cuentas_por_cobrar",
        indexes = {
                @Index(name = "idx_cxc_cliente", columnList = "cliente_id"),
                @Index(name = "idx_cxc_estado", columnList = "estado"),
                @Index(name = "idx_cxc_venta", columnList = "venta_id")
        }
)
@Data
public class CuentaPorCobrar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "venta_id", nullable = false, unique = true)
    private Venta venta;

    @ManyToOne(optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal montoTotal;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal montoPagado = BigDecimal.ZERO;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal saldoPendiente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoCuentaCobrar estado;

    private LocalDate fechaVencimiento;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    public void onCreate() {
        if (this.fechaCreacion == null) {
            this.fechaCreacion = LocalDateTime.now();
        }
        if (this.montoPagado == null) {
            this.montoPagado = BigDecimal.ZERO;
        }
    }
}