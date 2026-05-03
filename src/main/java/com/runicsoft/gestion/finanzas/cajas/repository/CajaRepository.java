package com.runicsoft.gestion.finanzas.cajas.repository;

import com.runicsoft.gestion.finanzas.cajas.model.Caja;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CajaRepository extends JpaRepository<Caja, Long> {
    Optional<Caja> findByEmpresaIdAndPrincipalTrue(Long empresaId);
    boolean existsByEmpresaIdAndNombreIgnoreCase(Long empresaId, String nombre);
    List<Caja> findByEmpresaId(Long empresaId);
    List<Caja> findByEmpresaIdAndActivaTrue(Long empresaId);
    Optional<Caja> findByIdAndEmpresaId(Long id, Long empresaId);
}