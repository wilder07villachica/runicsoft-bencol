package com.runicsoft.gestion.utils;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum EstadoUsuario {

    PENDIENTE_VERIFICACION,
    ACTIVO,
    INACTIVO,
    BLOQUEADO;
}
