package com.runicsoft.gestion.autenticacion.repository;

import com.runicsoft.gestion.autenticacion.model.SesionUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SesionUsuarioRepository extends JpaRepository<SesionUsuario, Long> {
    boolean existsByTokenJtiAndActivaTrue(String tokenJti);
}
