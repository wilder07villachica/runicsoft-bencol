package com.runicsoft.gestion.utils;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum TipoProducto {

    BIDON_20_LITROS("Bidon 20 Litros"),
    BOTELLA_650_MILILITROS("Botella 650 Mililitros"),
    BOTELLA_1_LITRO("Botella 1 Litro"),
    BOTELLA_2_5_LITROS("Botella 2.5 Litros");

    private final String descripcion;
}
