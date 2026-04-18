package com.runicsoft.gestion.ventas.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.utils.EstadoVenta;
import com.runicsoft.gestion.utils.MetodoPago;
import com.runicsoft.gestion.utils.TipoPago;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ventas")
@Data
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<DetalleVenta>  detalleVentas;

    @Column(name = "total_pagar")
    private BigDecimal totalPagar;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_pago")
    private TipoPago tipoPago = TipoPago.CREDITO;

    @Column(name = "cantidad_pagada")
    private BigDecimal cantidadPagada =  BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago")
    private MetodoPago metodoPago = MetodoPago.EFECTIVO;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoVenta estadoVenta = EstadoVenta.EN_ESPERA;

    @PrePersist
    public void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }

    // METODOS
    public void calcularTipoPago() {
        if (cantidadPagada == null) {
            cantidadPagada = BigDecimal.ZERO;
        }
        if (cantidadPagada.compareTo(BigDecimal.ZERO) == 0) {
            tipoPago = TipoPago.CREDITO;
        }
        else if (cantidadPagada.compareTo(totalPagar) < 0) {
            tipoPago = TipoPago.ABONO;
        }
        else {
            tipoPago = TipoPago.CANCELADO;
        }
    }
}
