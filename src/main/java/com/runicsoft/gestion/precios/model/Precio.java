package com.runicsoft.gestion.precios.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.productos.model.Producto;
import com.runicsoft.gestion.utils.TipoPrecio;
import com.runicsoft.gestion.utils.TipoProducto;
import jakarta.persistence.*;
import jdk.jfr.Timestamp;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "precios")
@Data
public class Precio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonIgnoreProperties("precios")
    private Cliente cliente;

    @ManyToOne(optional = false)
    @JoinColumn(name = "producto_id", nullable = false)
    @JsonIgnoreProperties
    private Producto producto;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal precio;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_precio", nullable = false)
    private TipoPrecio tipoPrecio = TipoPrecio.POR_MENOR;

    @Column(name = "cantidad_minima", nullable = false)
    private Integer cantidadMinima;

    @Timestamp
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @PrePersist
    public void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }
}
