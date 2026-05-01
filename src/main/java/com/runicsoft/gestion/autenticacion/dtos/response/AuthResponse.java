package com.runicsoft.gestion.autenticacion.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tipo;
    private UsuarioResponse usuario;
}
