package com.runicsoft.gestion.utils;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum CategoriaCliente {

    DISTRIBUIDOR("Distribuidor"),
    CONSUMIDOR_FINAL("Consumidor final"),
    CORPORATIVO("Corporativo");

    private final String descripcion;
}
