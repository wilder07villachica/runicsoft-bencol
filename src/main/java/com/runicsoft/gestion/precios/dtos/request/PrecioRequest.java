package com.runicsoft.gestion.precios.dtos.request;

import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.productos.model.Producto;
import com.runicsoft.gestion.utils.TipoPrecio;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PrecioRequest {
    private Cliente cliente;
    private Producto producto;
    private BigDecimal precio;
    private TipoPrecio tipoPrecio;
    private Integer cantidadMinima;
}
