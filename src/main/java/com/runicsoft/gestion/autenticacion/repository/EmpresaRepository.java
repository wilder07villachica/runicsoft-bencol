package com.runicsoft.gestion.autenticacion.repository;

import com.runicsoft.gestion.autenticacion.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    boolean existsByRuc(String ruc);
}