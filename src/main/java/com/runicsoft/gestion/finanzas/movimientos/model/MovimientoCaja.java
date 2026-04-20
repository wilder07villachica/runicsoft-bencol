package com.runicsoft.gestion.finanzas.movimientos.model;

import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.finanzas.cajas.model.Caja;
import com.runicsoft.gestion.finanzas.shared.CategoriaEgreso;
import com.runicsoft.gestion.finanzas.shared.OrigenMovimientoCaja;
import com.runicsoft.gestion.finanzas.shared.TipoMovimientoCaja;
import com.runicsoft.gestion.utils.MetodoPago;
import com.runicsoft.gestion.ventas.model.Venta;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "movimientos_caja",
        indexes = {
                @Index(name = "idx_mov_caja", columnList = "caja_id"),
                @Index(name = "idx_mov_fecha", columnList = "fecha"),
                @Index(name = "idx_mov_tipo", columnList = "tipo"),
                @Index(name = "idx_mov_origen", columnList = "origen"),
                @Index(name = "idx_mov_venta", columnList = "venta_id")
        }
)
@Data
public class MovimientoCaja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "caja_id", nullable = false)
    private Caja caja;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoMovimientoCaja tipo;

    @Enumerated(EnumType.STRING)
    @Column(name = "categoria_egreso")
    private CategoriaEgreso categoriaEgreso;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private OrigenMovimientoCaja origen;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal monto;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private MetodoPago metodoPago;

    @Column(length = 200)
    private String referencia;

    @Column(length = 300)
    private String observacion;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "venta_id")
    private Venta venta;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fecha;

    @PrePersist
    public void onCreate() {
        this.fecha = LocalDateTime.now();
    }
}