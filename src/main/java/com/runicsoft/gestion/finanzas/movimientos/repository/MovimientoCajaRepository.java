package com.runicsoft.gestion.finanzas.movimientos.repository;

import com.runicsoft.gestion.finanzas.movimientos.model.MovimientoCaja;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MovimientoCajaRepository extends JpaRepository<MovimientoCaja, Long> {

    @Override
    @EntityGraph(attributePaths = {"caja", "cliente", "venta"})
    List<MovimientoCaja> findAll();

    @Override
    @EntityGraph(attributePaths = {"caja", "cliente", "venta"})
    Optional<MovimientoCaja> findById(Long id);

    @EntityGraph(attributePaths = {"caja", "cliente", "venta"})
    List<MovimientoCaja> findByCajaIdOrderByFechaDesc(Long cajaId);
}