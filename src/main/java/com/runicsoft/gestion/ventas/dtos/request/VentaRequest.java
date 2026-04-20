package com.runicsoft.gestion.ventas.dtos.request;

import com.runicsoft.gestion.utils.MetodoPago;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VentaRequest {
    private Long clienteId;
    private Long cajaId;
    private BigDecimal cantidadPagada;
    private MetodoPago metodoPago;
    private List<DetalleVentaRequest> detalleVentas;
}
