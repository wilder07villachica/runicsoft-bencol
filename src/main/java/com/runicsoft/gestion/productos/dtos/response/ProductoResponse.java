package com.runicsoft.gestion.productos.dtos.response;

import com.runicsoft.gestion.utils.TipoProducto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductoResponse {
    private TipoProducto tipo;
    private BigDecimal precio;
}
