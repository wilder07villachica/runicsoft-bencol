package com.runicsoft.gestion.finanzas.cajas.repository;

import com.runicsoft.gestion.finanzas.cajas.model.Caja;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CajaRepository extends JpaRepository<Caja, Long> {
    Optional<Caja> findByPrincipalTrue();
    boolean existsByNombreIgnoreCase(String nombre);
    List<Caja> findByActivaTrue();
}