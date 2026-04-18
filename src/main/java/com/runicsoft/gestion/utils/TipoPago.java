package com.runicsoft.gestion.utils;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum TipoPago {

    CREDITO("Credito"),
    CANCELADO("Cancelado"),
    ABONO("Abono");

    private final String descripcion;
}
