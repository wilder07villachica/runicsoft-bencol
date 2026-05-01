package com.runicsoft.gestion.autenticacion.security;

import com.runicsoft.gestion.autenticacion.model.Usuario;
import com.runicsoft.gestion.autenticacion.repository.UsuarioRepository;
import com.runicsoft.gestion.utils.EstadoUsuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreo(username.toLowerCase().trim())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        boolean enabled = usuario.getEstado() == EstadoUsuario.ACTIVO && Boolean.TRUE.equals(usuario.getEmailVerificado());

        return User.builder()
                .username(usuario.getCorreo())
                .password(usuario.getPasswordHash() == null ? "" : usuario.getPasswordHash())
                .disabled(!enabled)
                .accountLocked(usuario.getEstado() == EstadoUsuario.BLOQUEADO)
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().getNombre().name())))
                .build();
    }
}
