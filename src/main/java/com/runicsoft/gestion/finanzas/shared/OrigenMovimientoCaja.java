package com.runicsoft.gestion.finanzas.shared;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum OrigenMovimientoCaja {
    VENTA("Venta"),
    ABONO_CUENTA_COBRAR("Abono"),
    EGRESO_MANUAL("Egreso manual"),
    INGRESO_MANUAL("Ingreso manual"),
    APERTURA_CAJA("Apertura de caja"),
    CIERRE_CAJA("Cierre de caja"),
    AJUSTE("Ajuste");

    private final String descripcion;
}
