package com.runicsoft.gestion.utils;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum EstadoVenta {

    ATENDIDO("Atendido"),
    EN_ESPERA("En Espera"),
    CANCELADO("Cancelado"),
    REPROGRAMADO("Reprogramado");

    private final String descripcion;
}
