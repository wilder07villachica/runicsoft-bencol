package com.runicsoft.gestion.clientes.mapper;

import com.runicsoft.gestion.clientes.dtos.request.ClienteRequest;
import com.runicsoft.gestion.clientes.dtos.response.ClienteResponse;
import com.runicsoft.gestion.clientes.model.Cliente;
import org.springframework.stereotype.Component;

@Component
public class ClienteMapper {

    public Cliente toEntity(ClienteRequest request) {
        Cliente cliente = new Cliente();
        cliente.setNombre(request.getNombre());
        cliente.setDireccion(request.getDireccion());
        cliente.setCorreo(request.getCorreo());
        cliente.setTelefono(request.getTelefono());
        cliente.setCategoria(request.getCategoria());
        cliente.setEstado(request.getEstado());
        return cliente;
    }

    public ClienteResponse toResponse(Cliente cliente) {
        return new ClienteResponse(
                cliente.getId(),
                cliente.getNombre(),
                cliente.getDireccion(),
                cliente.getCorreo(),
                cliente.getTelefono(),
                cliente.getCategoria(),
                cliente.getEstado()
        );
    }

    public void updateEntityFromRequest(Cliente cliente, ClienteRequest request) {
        cliente.setNombre(request.getNombre());
        cliente.setDireccion(request.getDireccion());
        cliente.setCorreo(request.getCorreo());
        cliente.setTelefono(request.getTelefono());
        cliente.setCategoria(request.getCategoria());
        cliente.setEstado(request.getEstado());
    }
}
