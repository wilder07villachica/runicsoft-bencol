package com.runicsoft.gestion.finanzas.cajas.service;

import com.runicsoft.gestion.autenticacion.model.Empresa;
import com.runicsoft.gestion.autenticacion.service.UsuarioAutenticadoService;
import com.runicsoft.gestion.finanzas.cajas.dtos.request.CajaRequest;
import com.runicsoft.gestion.finanzas.cajas.dtos.response.CajaResponse;
import com.runicsoft.gestion.finanzas.cajas.model.Caja;
import com.runicsoft.gestion.finanzas.cajas.repository.CajaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CajaService {

    private final CajaRepository cajaRepository;
    private final UsuarioAutenticadoService usuarioAutenticadoService;

    @Transactional(readOnly = true)
    public List<CajaResponse> findAll() {
        Long empresaId = usuarioAutenticadoService.getEmpresaActualId();

        return cajaRepository.findByEmpresaId(empresaId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CajaResponse> findActivas() {
        Long empresaId = usuarioAutenticadoService.getEmpresaActualId();

        return cajaRepository.findByEmpresaIdAndActivaTrue(empresaId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CajaResponse findById(Long id) {
        return toResponse(findEntityById(id));
    }

    @Transactional(readOnly = true)
    public CajaResponse findPrincipal() {
        Long empresaId = usuarioAutenticadoService.getEmpresaActualId();

        Caja caja = cajaRepository.findByEmpresaIdAndPrincipalTrue(empresaId)
                .orElseThrow(() -> new IllegalArgumentException("No existe una caja principal registrada."));

        return toResponse(caja);
    }

    @Transactional
    public CajaResponse save(CajaRequest request) {
        validarRequest(request);

        Empresa empresa = usuarioAutenticadoService.getEmpresaActual();
        Long empresaId = empresa.getId();

        String nombre = request.getNombre().trim();

        if (cajaRepository.existsByEmpresaIdAndNombreIgnoreCase(empresaId, nombre)) {
            throw new IllegalArgumentException("Ya existe una caja con ese nombre.");
        }

        Caja caja = new Caja();
        caja.setEmpresa(empresa);
        caja.setNombre(nombre);
        caja.setDescripcion(limpiarTexto(request.getDescripcion()));
        caja.setSaldoActual(request.getSaldoActual() != null ? request.getSaldoActual() : BigDecimal.ZERO);
        caja.setActiva(request.getActiva() != null ? request.getActiva() : true);

        boolean seraPrincipal = request.getPrincipal() != null && request.getPrincipal();

        if (seraPrincipal) {
            desmarcarCajaPrincipalActual(empresaId);
            caja.setPrincipal(true);
            caja.setActiva(true);
        } else {
            caja.setPrincipal(false);
        }

        Caja cajaGuardada = cajaRepository.save(caja);

        return toResponse(cajaGuardada);
    }

    @Transactional
    public CajaResponse update(Long id, CajaRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("La solicitud no puede ser nula.");
        }

        Caja caja = findEntityById(id);
        Long empresaId = caja.getEmpresa().getId();

        if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la caja es obligatorio.");
        }

        String nuevoNombre = request.getNombre().trim();

        if (!caja.getNombre().equalsIgnoreCase(nuevoNombre)
                && cajaRepository.existsByEmpresaIdAndNombreIgnoreCase(empresaId, nuevoNombre)) {
            throw new IllegalArgumentException("Ya existe una caja con ese nombre.");
        }

        caja.setNombre(nuevoNombre);
        caja.setDescripcion(limpiarTexto(request.getDescripcion()));

        Caja cajaActualizada = cajaRepository.save(caja);

        return toResponse(cajaActualizada);
    }

    @Transactional
    public CajaResponse activar(Long id) {
        Caja caja = findEntityById(id);

        if (Boolean.TRUE.equals(caja.getActiva())) {
            throw new IllegalArgumentException("La caja ya se encuentra activa.");
        }

        caja.setActiva(true);

        return toResponse(cajaRepository.save(caja));
    }

    @Transactional
    public CajaResponse desactivar(Long id) {
        Caja caja = findEntityById(id);

        if (Boolean.FALSE.equals(caja.getActiva())) {
            throw new IllegalArgumentException("La caja ya se encuentra inactiva.");
        }

        if (Boolean.TRUE.equals(caja.getPrincipal())) {
            throw new IllegalArgumentException("No se puede desactivar la caja principal. Primero asigne otra caja principal.");
        }

        caja.setActiva(false);

        return toResponse(cajaRepository.save(caja));
    }

    @Transactional
    public CajaResponse marcarComoPrincipal(Long id) {
        Caja nuevaPrincipal = findEntityById(id);

        if (Boolean.TRUE.equals(nuevaPrincipal.getPrincipal())) {
            return toResponse(nuevaPrincipal);
        }

        Long empresaId = nuevaPrincipal.getEmpresa().getId();

        desmarcarCajaPrincipalActual(empresaId);

        nuevaPrincipal.setPrincipal(true);
        nuevaPrincipal.setActiva(true);

        Caja cajaGuardada = cajaRepository.save(nuevaPrincipal);

        return toResponse(cajaGuardada);
    }

    private void validarRequest(CajaRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("La solicitud no puede ser nula.");
        }

        if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la caja es obligatorio.");
        }

        if (request.getSaldoActual() != null && request.getSaldoActual().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("El saldo de la caja no puede ser negativo.");
        }
    }

    private Caja findEntityById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Debe proporcionar un ID de caja válido.");
        }

        Long empresaId = usuarioAutenticadoService.getEmpresaActualId();

        return cajaRepository.findByIdAndEmpresaId(id, empresaId)
                .orElseThrow(() -> new IllegalArgumentException("La caja con ID " + id + " no existe."));
    }

    private void desmarcarCajaPrincipalActual(Long empresaId) {
        cajaRepository.findByEmpresaIdAndPrincipalTrue(empresaId).ifPresent(cajaPrincipal -> {
            cajaPrincipal.setPrincipal(false);
            cajaRepository.save(cajaPrincipal);
        });
    }

    private String limpiarTexto(String texto) {
        if (texto == null || texto.trim().isEmpty()) {
            return null;
        }

        return texto.trim();
    }

    private CajaResponse toResponse(Caja caja) {
        return new CajaResponse(
                caja.getId(),
                caja.getNombre(),
                caja.getDescripcion(),
                caja.getSaldoActual(),
                caja.getActiva(),
                caja.getPrincipal(),
                caja.getFechaCreacion()
        );
    }
}