package com.runicsoft.gestion.clientes.service;

import com.runicsoft.gestion.autenticacion.model.Empresa;
import com.runicsoft.gestion.autenticacion.service.UsuarioAutenticadoService;
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
    private final UsuarioAutenticadoService usuarioAutenticadoService;

    @Transactional(readOnly = true)
    public List<ClienteResponse> findAll() {
        Long empresaId = usuarioAutenticadoService.getEmpresaActualId();

        return clienteRepository.findByEmpresaId(empresaId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClienteResponse findById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Ingresar un ID valido para poder continuar.");
        }

        Long empresaId = usuarioAutenticadoService.getEmpresaActualId();

        Cliente cliente = clienteRepository.findByIdAndEmpresaId(id, empresaId)
                .orElseThrow(() -> new IllegalArgumentException("El registro con el ID: " + id + " no existe"));

        return mapper.toResponse(cliente);
    }

    @Transactional
    public ClienteResponse save(ClienteRequest request) {
        if (request.getCorreo() != null && request.getCorreo().isBlank()) {
            request.setCorreo(null);
        }

        Empresa empresa = usuarioAutenticadoService.getEmpresaActual();
        Long empresaId = empresa.getId();

        String correo = request.getCorreo();

        if (correo != null && clienteRepository.existsByEmpresaIdAndCorreo(empresaId, correo)) {
            throw new IllegalArgumentException("El correo registrado ya está en uso.");
        }

        Cliente cliente = mapper.toEntity(request);
        cliente.setEmpresa(empresa);

        Cliente clienteGuardado = clienteRepository.save(cliente);

        return mapper.toResponse(clienteGuardado);
    }

    @Transactional
    public ClienteResponse update(Long id, ClienteRequest request) {
        Long empresaId = usuarioAutenticadoService.getEmpresaActualId();

        Cliente clienteUpdate = clienteRepository.findByIdAndEmpresaId(id, empresaId)
                .orElseThrow(() -> new IllegalArgumentException("El registro con el ID: " + id + " no existe"));

        if (request.getCorreo() != null && request.getCorreo().isBlank()) {
            request.setCorreo(null);
        }

        String correo = request.getCorreo();

        if (correo != null && clienteRepository.existsByEmpresaIdAndCorreoAndIdNot(empresaId, correo, id)) {
            throw new IllegalArgumentException("El correo registrado ya está en uso.");
        }

        mapper.updateEntityFromRequest(clienteUpdate, request);

        Cliente clienteActualizado = clienteRepository.save(clienteUpdate);

        return mapper.toResponse(clienteActualizado);
    }
}