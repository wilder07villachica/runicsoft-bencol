package com.runicsoft.gestion.clientes.dtos.request;

import com.runicsoft.gestion.utils.CategoriaCliente;
import com.runicsoft.gestion.utils.Estado;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClienteRequest {
    private String nombre;
    private String direccion;
    private String correo;
    private String telefono;
    private CategoriaCliente categoria;
    private Estado estado;
}
