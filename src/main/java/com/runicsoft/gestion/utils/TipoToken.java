package com.runicsoft.gestion.utils;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum TipoToken {

    VERIFICACION_EMAIL,
    RECUPERACION_PASSWORD;
}
