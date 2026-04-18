package com.runicsoft.gestion.utils;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum MetodoPago {

    EFECTIVO("Efectivo"),
    TRANSFERENCIA("Transferencia"),
    YAPE_PLIN("Yape - plin");

    private final String descripcion;
}
