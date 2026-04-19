package com.runicsoft.gestion.clientes.service;

import com.runicsoft.gestion.clientes.dtos.request.ClienteRequest;
import com.runicsoft.gestion.clientes.dtos.response.ClienteResponse;
import com.runicsoft.gestion.clientes.mapper.ClienteMapper;
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
    private final ClienteMapper mapper;

    @Transactional(readOnly = true)
    public List<ClienteResponse> findAll() {
        return clienteRepository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClienteResponse findById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Ingresar un ID valido para poder continuar.");
        }
        Cliente cliente = clienteRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("El registro con el ID: " +  id + " no existe")
        );
        return mapper.toResponse(cliente);
    }

    @Transactional
    public ClienteResponse save(ClienteRequest request) {
        if (clienteRepository.existsByCorreo(request.getCorreo())) {
            throw new IllegalArgumentException("El correo registrado ya está en uso.");
        }
        Cliente cliente = mapper.toEntity(request);
        Cliente clienteGuardado = clienteRepository.save(cliente);
        return mapper.toResponse(clienteGuardado);
    }

    @Transactional
    public ClienteResponse update(Long id, ClienteRequest request) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID inválido");
        }
        Cliente clienteUpdate = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "El registro con el ID: " + id + " no existe"
                ));
        if (clienteRepository.existsByCorreoAndIdNot(request.getCorreo(), id)) {
            throw new IllegalArgumentException("El correo registrado ya está en uso.");
        }
        mapper.updateEntityFromRequest(clienteUpdate, request);
        Cliente clienteActualizado = clienteRepository.save(clienteUpdate);
        return mapper.toResponse(clienteActualizado);
    }
}
