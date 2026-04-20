package com.runicsoft.gestion.finanzas.movimientos.dtos.response;

import com.runicsoft.gestion.finanzas.shared.CategoriaEgreso;
import com.runicsoft.gestion.finanzas.shared.OrigenMovimientoCaja;
import com.runicsoft.gestion.finanzas.shared.TipoMovimientoCaja;
import com.runicsoft.gestion.utils.MetodoPago;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class MovimientoCajaResponse {

    private Long id;
    private Long cajaId;
    private String cajaNombre;
    private TipoMovimientoCaja tipo;
    private CategoriaEgreso categoriaEgreso;
    private OrigenMovimientoCaja origen;
    private BigDecimal monto;
    private MetodoPago metodoPago;
    private String referencia;
    private String observacion;
    private Long clienteId;
    private String clienteNombre;
    private Long ventaId;
    private LocalDateTime fecha;
}