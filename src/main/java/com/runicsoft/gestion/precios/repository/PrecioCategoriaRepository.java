package com.runicsoft.gestion.precios.repository;

import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.precios.model.Precio;
import com.runicsoft.gestion.precios.model.PrecioCategoria;
import com.runicsoft.gestion.productos.model.Producto;
import com.runicsoft.gestion.utils.CategoriaCliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrecioCategoriaRepository extends JpaRepository<PrecioCategoria, Long> {
    Optional<PrecioCategoria> findByCategoriaClienteAndProducto(CategoriaCliente categoriaCliente, Producto producto);
}
