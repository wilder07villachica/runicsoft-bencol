package com.runicsoft.gestion.autenticacion.service;

import com.runicsoft.gestion.autenticacion.model.Empresa;
import com.runicsoft.gestion.autenticacion.model.Usuario;
import com.runicsoft.gestion.autenticacion.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioAutenticadoService {

    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public Usuario getUsuarioActual() {
        String correo = SecurityContextHolder.getContext().getAuthentication().getName();

        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new IllegalArgumentException("Usuario autenticado no encontrado."));
    }

    @Transactional(readOnly = true)
    public Empresa getEmpresaActual() {
        Usuario usuario = getUsuarioActual();

        if (usuario.getEmpresa() == null) {
            throw new IllegalArgumentException("El usuario no tiene una empresa asociada.");
        }

        return usuario.getEmpresa();
    }

    @Transactional(readOnly = true)
    public Long getEmpresaActualId() {
        return getEmpresaActual().getId();
    }
}