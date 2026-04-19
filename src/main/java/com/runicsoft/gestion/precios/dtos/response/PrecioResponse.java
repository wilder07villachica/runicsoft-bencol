package com.runicsoft.gestion.precios.dtos.response;

import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.productos.model.Producto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PrecioResponse {
    private Cliente cliente;
    private Producto producto;
    private BigDecimal precio;
}
