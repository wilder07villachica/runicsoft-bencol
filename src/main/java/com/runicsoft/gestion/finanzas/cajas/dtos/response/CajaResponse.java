package com.runicsoft.gestion.finanzas.cajas.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CajaResponse {

    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal saldoActual;
    private Boolean activa;
    private Boolean principal;
    private LocalDateTime fechaCreacion;
}