package com.runicsoft.gestion.ventas.dtos.response;

import com.runicsoft.gestion.utils.EstadoVenta;
import com.runicsoft.gestion.utils.MetodoPago;
import com.runicsoft.gestion.utils.TipoPago;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VentaResponse {
    private Long id;
    private Long clienteId;
    private String nombreCliente;
    private BigDecimal totalPagar;
    private TipoPago tipoPago;
    private BigDecimal cantidadPagada;
    private MetodoPago metodoPago;
    private LocalDateTime fechaCreacion;
    private EstadoVenta estadoVenta;
    private List<DetalleVentaResponse> detalleVentas;
}
