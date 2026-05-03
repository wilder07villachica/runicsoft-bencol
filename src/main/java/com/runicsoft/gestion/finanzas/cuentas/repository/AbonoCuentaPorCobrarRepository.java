package com.runicsoft.gestion.finanzas.cuentas.repository;

import com.runicsoft.gestion.finanzas.cuentas.model.AbonoCuentaPorCobrar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AbonoCuentaPorCobrarRepository extends JpaRepository<AbonoCuentaPorCobrar, Long> {
    List<AbonoCuentaPorCobrar> findByEmpresaId(Long empresaId);
    List<AbonoCuentaPorCobrar> findByEmpresaIdAndCuentaPorCobrarId(Long empresaId, Long cuentaPorCobrarId);
}