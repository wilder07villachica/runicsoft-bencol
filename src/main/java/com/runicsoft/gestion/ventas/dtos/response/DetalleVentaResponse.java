package com.runicsoft.gestion.ventas.dtos.response;

import com.runicsoft.gestion.utils.TipoProducto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DetalleVentaResponse {
    private Long id;
    private Long productoId;
    private TipoProducto tipoProducto;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
}
