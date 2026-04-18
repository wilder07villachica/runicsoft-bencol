package com.runicsoft.gestion.precios.repository;

import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.precios.model.Precio;
import com.runicsoft.gestion.productos.model.Producto;
import com.runicsoft.gestion.utils.TipoPrecio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrecioRepository extends JpaRepository<Precio, Long> {
    boolean existsByClienteIdAndProductoIdAndTipoPrecio(Long clienteId, Long productoId, TipoPrecio tipoPrecio);
    Optional<Precio> findByClienteAndProducto(Cliente cliente, Producto producto);
}
