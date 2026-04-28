package com.runicsoft.gestion.finanzas.cuentas.repository;

import com.runicsoft.gestion.finanzas.cuentas.model.CuentaPorCobrar;
import com.runicsoft.gestion.finanzas.shared.EstadoCuentaCobrar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CuentaPorCobrarRepository extends JpaRepository<CuentaPorCobrar, Long> {
    List<CuentaPorCobrar> findByClienteId(Long clienteId);
    List<CuentaPorCobrar> findByEstado(EstadoCuentaCobrar estado);
    Optional<CuentaPorCobrar> findByVentaId(Long ventaId);
    boolean existsByVentaId(Long ventaId);
}