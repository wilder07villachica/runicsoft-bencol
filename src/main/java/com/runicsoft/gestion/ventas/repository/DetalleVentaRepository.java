package com.runicsoft.gestion.ventas.repository;

import com.runicsoft.gestion.ventas.model.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta,Long> {
}
