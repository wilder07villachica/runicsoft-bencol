package com.runicsoft.gestion.clientes.dtos.response;

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
public class ClienteResponse {
    private String nombre;
    private String direccion;
    private CategoriaCliente categoria;
    private Estado estado;
}
