package com.runicsoft.gestion.utils;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum TipoPrecio {

    POR_MAYOR("Por Mayor"),
    POR_MENOR("Por Menor");

    private final String descripcion;
}
