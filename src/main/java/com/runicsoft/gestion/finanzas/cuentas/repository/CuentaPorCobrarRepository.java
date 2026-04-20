package com.runicsoft.gestion.finanzas.cuentas.repository;

import com.runicsoft.gestion.finanzas.cuentas.model.CuentaPorCobrar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CuentaPorCobrarRepository extends JpaRepository<CuentaPorCobrar, Long> {
    List<CuentaPorCobrar> findByClienteId(Long clienteId);
    boolean existsByVentaId(Long ventaId);
}