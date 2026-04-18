package com.runicsoft.gestion.utils;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum Estado {

    ACTIVO("Activo"),
    INACTIVO("Inactivo");

    private final String descripcion;
}
