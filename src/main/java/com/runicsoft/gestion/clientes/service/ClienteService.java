package com.runicsoft.gestion.clientes.service;

import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.clientes.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    @Transactional(readOnly = true)
    public List<Cliente> findAll() {
        return clienteRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Cliente findById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Ingresar un ID valido para poder continuar.");
        }
        return clienteRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("El registro con el ID: " +  id + " no existe")
        );
    }

    @Transactional
    public Cliente save(Cliente cliente) {
        String correo = cliente.getCorreo();
        if (clienteRepository.existsByCorreo(correo)) {
            throw new IllegalArgumentException("El correo registrado ya esta en uso.");
        }
        return clienteRepository.save(cliente);
    }

    @Transactional
    public Cliente update(Long id, Cliente cliente) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID inválido");
        }
        Cliente clienteUpdate = clienteRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("El registro con el ID: " +  id + " no existe")
        );
        clienteUpdate.setNombre(cliente.getNombre());
        clienteUpdate.setDireccion(cliente.getDireccion());
        clienteUpdate.setCorreo(cliente.getCorreo());
        clienteUpdate.setTelefono(cliente.getTelefono());
        clienteUpdate.setCategoria(cliente.getCategoria());
        clienteUpdate.setEstado(cliente.getEstado());
        return clienteRepository.save(clienteUpdate);
    }
}
