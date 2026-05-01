package com.runicsoft.gestion.autenticacion.dtos.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UsuarioResponse {
    private Long id;
    private String nombre;
    private String correo;
    private String celular;
    private String rol;
    private String estado;
    private Boolean emailVerificado;
}
