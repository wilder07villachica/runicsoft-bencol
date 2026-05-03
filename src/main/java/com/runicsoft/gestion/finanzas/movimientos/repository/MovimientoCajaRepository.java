package com.runicsoft.gestion.finanzas.movimientos.repository;

import com.runicsoft.gestion.finanzas.movimientos.model.MovimientoCaja;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MovimientoCajaRepository extends JpaRepository<MovimientoCaja, Long> {

    @EntityGraph(attributePaths = {"caja", "cliente", "venta"})
    List<MovimientoCaja> findByEmpresaId(Long empresaId);

    @EntityGraph(attributePaths = {"caja", "cliente", "venta"})
    Optional<MovimientoCaja> findByIdAndEmpresaId(Long id, Long empresaId);

    @EntityGraph(attributePaths = {"caja", "cliente", "venta"})
    List<MovimientoCaja> findByEmpresaIdAndCajaIdOrderByFechaDesc(Long empresaId, Long cajaId);
}