package com.runicsoft.gestion.precios.dtos.response;

import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.productos.model.Producto;
import com.runicsoft.gestion.utils.TipoPrecio;
import com.runicsoft.gestion.utils.TipoProducto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PrecioResponse {
    private Long id;
    private Long clienteId;
    private String nombreCliente;
    private Long productoId;
    private TipoProducto tipoProducto;
    private BigDecimal precio;
    private TipoPrecio tipoPrecio;
    private Integer cantidadMinima;
    private LocalDateTime fechaCreacion;
}
