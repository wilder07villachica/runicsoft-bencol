package com.runicsoft.gestion.autenticacion.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EmpresaRequest {

    @Size(max = 250)
    private String razonSocial;

    @Size(max = 250)
    private String nombreComercial;

    @Size(max = 20)
    private String ruc;

    @Email
    @Size(max = 250)
    private String correo;

    @Size(max = 20)
    private String telefono;

    @Size(max = 250)
    private String direccion;
}