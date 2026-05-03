package com.runicsoft.gestion.clientes.repository;

import com.runicsoft.gestion.clientes.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    List<Cliente> findByEmpresaId(Long empresaId);
    Optional<Cliente> findByIdAndEmpresaId(Long id, Long empresaId);
    boolean existsByEmpresaIdAndCorreo(Long empresaId, String correo);
    boolean existsByEmpresaIdAndCorreoAndIdNot(Long empresaId, String correo, Long id);
}