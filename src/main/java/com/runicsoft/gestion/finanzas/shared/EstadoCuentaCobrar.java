package com.runicsoft.gestion.finanzas.shared;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum EstadoCuentaCobrar {

    PENDIENTE("Pendiente"),
    PARCIAL("Parcial"),
    PAGADA("Pagada");

    private final String descripcion;
}
