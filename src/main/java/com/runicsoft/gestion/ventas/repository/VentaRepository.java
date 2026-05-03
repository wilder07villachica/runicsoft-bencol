package com.runicsoft.gestion.ventas.repository;

import com.runicsoft.gestion.ventas.model.Venta;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {

    @EntityGraph(attributePaths = {
            "cliente",
            "detalleVentas",
            "detalleVentas.producto"
    })
    List<Venta> findByEmpresaId(Long empresaId);

    @EntityGraph(attributePaths = {
            "cliente",
            "detalleVentas",
            "detalleVentas.producto"
    })
    Optional<Venta> findByIdAndEmpresaId(Long id, Long empresaId);

    @Override
    @EntityGraph(attributePaths = {
            "cliente",
            "detalleVentas",
            "detalleVentas.producto"
    })
    Optional<Venta> findById(Long id);
}