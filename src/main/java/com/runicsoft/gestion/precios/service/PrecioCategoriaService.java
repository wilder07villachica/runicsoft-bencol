package com.runicsoft.gestion.precios.service;

import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.precios.model.Precio;
import com.runicsoft.gestion.precios.model.PrecioCategoria;
import com.runicsoft.gestion.precios.repository.PrecioCategoriaRepository;
import com.runicsoft.gestion.precios.repository.PrecioRepository;
import com.runicsoft.gestion.productos.model.Producto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PrecioCategoriaService {

    private final PrecioCategoriaRepository precioCategoriaRepository;
    private final PrecioRepository precioRepository;

    public BigDecimal obtenerPrecio(Cliente cliente, Producto producto) {
        Optional<Precio> precioPersonalizado = precioRepository.findByClienteAndProducto(cliente, producto);
        if (precioPersonalizado.isPresent()) {
            return  precioPersonalizado.get().getPrecio();
        }
        PrecioCategoria precioCategoria = precioCategoriaRepository.findByCategoriaClienteAndProducto(
                cliente.getCategoria(), producto
        ).orElseThrow(() -> new IllegalArgumentException("No existe precio para este producto"));

        BigDecimal precioFinal = precioCategoria.getPrecio();
        if (precioCategoria.isAplicaIGV()) {
            precioFinal = precioFinal.multiply(new  BigDecimal("1.18"));
        }
        return precioFinal;
    }
}
