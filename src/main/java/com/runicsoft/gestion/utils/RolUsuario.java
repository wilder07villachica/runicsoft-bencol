package com.runicsoft.gestion.utils;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum RolUsuario {

    SUPER_ADMIN,
    ADMIN_EMPRESA,
    VENDEDOR,
    CAJA,
    SUPERVISOR
}
