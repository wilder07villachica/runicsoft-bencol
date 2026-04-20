package com.runicsoft.gestion.finanzas.cajas.dtos.request;

import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

@RequiredArgsConstructor
@Getter
public class CajaRequest {

    private String nombre;
    private String descripcion;

    // Solo se usa al crear la caja
    private BigDecimal saldoActual;

    private Boolean activa;
    private Boolean principal;
}