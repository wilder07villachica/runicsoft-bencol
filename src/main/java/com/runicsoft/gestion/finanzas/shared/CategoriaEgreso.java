package com.runicsoft.gestion.finanzas.shared;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum CategoriaEgreso {

    COMPRA_INSUMOS("Compra de Insumos"),
    TRANSPORTE("Transporte"),
    SERVICIOS("Servicios"),
    MANTENIMIENTO("Mantenimiento"),
    PLANILLA("Planilla"),
    OTROS("Otros");

    private final String descripcion;
}
