package com.runicsoft.gestion.precios.model;

import com.runicsoft.gestion.productos.model.Producto;
import com.runicsoft.gestion.utils.CategoriaCliente;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "precios_categoria")
@Data
public class PrecioCategoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "categoria_cliente", nullable = false)
    private CategoriaCliente categoriaCliente;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(name = "aplica_igv")
    private boolean aplicaIGV = false;
}
