package com.runicsoft.gestion.finanzas.cuentas.dtos.request;

import com.runicsoft.gestion.utils.MetodoPago;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

@RequiredArgsConstructor
@Getter
public class AbonoCuentaPorCobrarRequest {
    private Long cajaId;
    private BigDecimal monto;
    private MetodoPago metodoPago;
    private String referencia;
    private String observacion;
}