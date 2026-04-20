package com.runicsoft.gestion.finanzas.movimientos.dtos.request;

import com.runicsoft.gestion.finanzas.shared.CategoriaEgreso;
import com.runicsoft.gestion.finanzas.shared.OrigenMovimientoCaja;
import com.runicsoft.gestion.finanzas.shared.TipoMovimientoCaja;
import com.runicsoft.gestion.utils.MetodoPago;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@RequiredArgsConstructor
@Getter
@Setter
public class MovimientoCajaRequest {

    private Long cajaId;
    private TipoMovimientoCaja tipo;
    private CategoriaEgreso categoriaEgreso;
    private OrigenMovimientoCaja origen;
    private BigDecimal monto;
    private MetodoPago metodoPago;
    private String referencia;
    private String observacion;
    private Long clienteId;
    private Long ventaId;
}