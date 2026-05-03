package com.runicsoft.gestion.autenticacion.service;

import com.runicsoft.gestion.autenticacion.dtos.request.EmpresaRequest;
import com.runicsoft.gestion.autenticacion.dtos.response.EmpresaResponse;
import com.runicsoft.gestion.autenticacion.model.Empresa;
import com.runicsoft.gestion.autenticacion.repository.EmpresaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final UsuarioAutenticadoService usuarioAutenticadoService;

    @Transactional(readOnly = true)
    public EmpresaResponse obtenerMiEmpresa() {
        Empresa empresa = usuarioAutenticadoService.getEmpresaActual();
        return toResponse(empresa);
    }

    @Transactional
    public EmpresaResponse actualizarMiEmpresa(EmpresaRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("La solicitud no puede ser nula.");
        }

        Empresa empresa = usuarioAutenticadoService.getEmpresaActual();

        String ruc = limpiarTexto(request.getRuc());

        if (ruc != null && empresaRepository.existsByRucAndIdNot(ruc, empresa.getId())) {
            throw new IllegalArgumentException("El RUC ya está registrado por otra empresa.");
        }

        if (request.getRazonSocial() != null && !request.getRazonSocial().trim().isEmpty()) {
            empresa.setRazonSocial(request.getRazonSocial().trim());
        }

        if (request.getNombreComercial() != null && !request.getNombreComercial().trim().isEmpty()) {
            empresa.setNombreComercial(request.getNombreComercial().trim());
        }

        empresa.setRuc(ruc);
        empresa.setCorreo(limpiarTexto(request.getCorreo()));
        empresa.setTelefono(limpiarTexto(request.getTelefono()));
        empresa.setDireccion(limpiarTexto(request.getDireccion()));

        Empresa empresaActualizada = empresaRepository.save(empresa);

        return toResponse(empresaActualizada);
    }

    private String limpiarTexto(String texto) {
        if (texto == null || texto.trim().isEmpty()) {
            return null;
        }

        return texto.trim();
    }

    private EmpresaResponse toResponse(Empresa empresa) {
        return EmpresaResponse.builder()
                .id(empresa.getId())
                .razonSocial(empresa.getRazonSocial())
                .nombreComercial(empresa.getNombreComercial())
                .ruc(empresa.getRuc())
                .correo(empresa.getCorreo())
                .telefono(empresa.getTelefono())
                .direccion(empresa.getDireccion())
                .estado(empresa.getEstado() != null ? empresa.getEstado().name() : null)
                .fechaCreacion(empresa.getFechaCreacion())
                .build();
    }
}