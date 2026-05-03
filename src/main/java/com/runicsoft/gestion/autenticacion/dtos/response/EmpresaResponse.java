package com.runicsoft.gestion.autenticacion.dtos.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EmpresaResponse {
    private Long id;
    private String razonSocial;
    private String nombreComercial;
    private String ruc;
    private String correo;
    private String telefono;
    private String direccion;
    private String estado;
    private LocalDateTime fechaCreacion;
}