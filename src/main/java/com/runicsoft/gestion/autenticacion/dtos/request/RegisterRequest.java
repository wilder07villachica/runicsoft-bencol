package com.runicsoft.gestion.autenticacion.dtos.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 150)
    private String nombre;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "Correo inválido")
    @Size(max = 250)
    private String correo;

    @NotBlank(message = "El celular es obligatorio")
    @Pattern(regexp = "^[0-9]{9,20}$", message = "El celular debe tener solo números")
    private String celular;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, max = 72, message = "La contraseña debe tener mínimo 8 caracteres")
    private String password;
}
