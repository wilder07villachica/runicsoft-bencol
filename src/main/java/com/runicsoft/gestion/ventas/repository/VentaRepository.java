package com.runicsoft.gestion.ventas.repository;

import com.runicsoft.gestion.ventas.model.Venta;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VentaRepository extends JpaRepository<Venta,Long> {

    @Override
    @EntityGraph(attributePaths = {
            "cliente",
            "detalleVentas",
            "detalleVentas.producto"
    })
    Optional<Venta> findById(Long id);
}
