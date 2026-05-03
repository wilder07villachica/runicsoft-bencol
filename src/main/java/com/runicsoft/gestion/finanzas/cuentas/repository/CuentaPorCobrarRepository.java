package com.runicsoft.gestion.finanzas.cuentas.repository;

import com.runicsoft.gestion.finanzas.cuentas.model.CuentaPorCobrar;
import com.runicsoft.gestion.finanzas.shared.EstadoCuentaCobrar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CuentaPorCobrarRepository extends JpaRepository<CuentaPorCobrar, Long> {
    List<CuentaPorCobrar> findByEmpresaId(Long empresaId);
    List<CuentaPorCobrar> findByEmpresaIdAndClienteId(Long empresaId, Long clienteId);
    List<CuentaPorCobrar> findByEmpresaIdAndEstado(Long empresaId, EstadoCuentaCobrar estado);
    Optional<CuentaPorCobrar> findByIdAndEmpresaId(Long id, Long empresaId);
    Optional<CuentaPorCobrar> findByVentaIdAndEmpresaId(Long ventaId, Long empresaId);
    boolean existsByVentaIdAndEmpresaId(Long ventaId, Long empresaId);
}