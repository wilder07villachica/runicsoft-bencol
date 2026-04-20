package com.runicsoft.gestion.finanzas.shared;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum TipoMovimientoCaja {

    INGRESO("Ingreso"),
    EGRESO("Egreso");

    private final String descripcion;
}
