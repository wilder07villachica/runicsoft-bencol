package com.runicsoft.gestion.autenticacion.repository;

import com.runicsoft.gestion.autenticacion.model.Usuario;
import com.runicsoft.gestion.autenticacion.model.UsuarioToken;
import com.runicsoft.gestion.utils.TipoToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioTokenRepository extends JpaRepository<UsuarioToken, Long> {
    Optional<UsuarioToken> findByTokenAndTipo(String token, TipoToken tipo);
    void deleteByUsuarioAndTipo(Usuario usuario, TipoToken tipo);
}
