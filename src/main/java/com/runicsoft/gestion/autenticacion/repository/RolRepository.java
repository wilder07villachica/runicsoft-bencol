package com.runicsoft.gestion.autenticacion.repository;

import com.runicsoft.gestion.autenticacion.model.Rol;
import com.runicsoft.gestion.utils.RolUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {
    Optional<Rol> findByNombre(RolUsuario usuario);
}
