package com.runicsoft.gestion.productos.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.runicsoft.gestion.autenticacion.model.Empresa;
import com.runicsoft.gestion.utils.Estado;
import com.runicsoft.gestion.utils.TipoProducto;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(
        name = "productos",
        indexes = {
                @Index(name = "idx_productos_empresa", columnList = "empresa_id")
        }
)
@Data
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    @JsonIgnore
    private Empresa empresa;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TipoProducto tipoProducto = TipoProducto.BIDON_20_LITROS;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal precio;

    @Enumerated(EnumType.STRING)
    private Estado estado = Estado.ACTIVO;
}