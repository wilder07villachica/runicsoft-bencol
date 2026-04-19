package com.runicsoft.gestion.ventas.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DetalleVentaRequest {
    private Long productoId;
    private Integer cantidad;
}