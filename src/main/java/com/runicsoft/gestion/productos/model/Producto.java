package com.runicsoft.gestion.productos.model;

import com.runicsoft.gestion.utils.Estado;
import com.runicsoft.gestion.utils.TipoProducto;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "productos")
@Data
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TipoProducto tipoProducto = TipoProducto.BIDON_20_LITROS;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal precio;

    @Enumerated(EnumType.STRING)
    private Estado estado = Estado.ACTIVO;
}
