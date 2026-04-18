package com.runicsoft.gestion.precios.service;

import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.clientes.repository.ClienteRepository;
import com.runicsoft.gestion.precios.model.Precio;
import com.runicsoft.gestion.precios.repository.PrecioRepository;
import com.runicsoft.gestion.productos.model.Producto;
import com.runicsoft.gestion.productos.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PrecioService {

    private final PrecioRepository precioRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;

    @Transactional(readOnly = true)
    public List<Precio> findAll() {
        return precioRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Precio findById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Ingresar un ID valido para poder continuar.");
        }
        return precioRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("El registro con el ID: " +  id + " no existe")
        );
    }

    @Transactional
    public Precio save(Precio precio) {
        if (precio.getCliente() == null || precio.getCliente().getId() == null || precio.getCliente().getId() <= 0) {
            throw new IllegalArgumentException("Ingresar un ID de cliente válido.");
        }
        if (precio.getProducto() == null || precio.getProducto().getId() == null || precio.getProducto().getId() <= 0) {
            throw new IllegalArgumentException("Ingresar un ID de producto válido.");
        }

        Cliente clienteId = clienteRepository.findById(precio.getCliente().getId()).orElseThrow(
                () -> new IllegalArgumentException("El cliente no existe")
        );
        Producto productoId= productoRepository.findById(precio.getProducto().getId()).orElseThrow(
                () -> new IllegalArgumentException("El producto no existe")
        );

        precio.setCliente(clienteId);
        precio.setProducto(productoId);

        boolean existe = precioRepository.existsByClienteIdAndProductoIdAndTipoPrecio(
                clienteId.getId(), productoId.getId(),  precio.getTipoPrecio()
        );
        if (existe) {
            throw new IllegalArgumentException("El precio ya existe para este cliente y producto.");
        }

        return precioRepository.save(precio);
    }
}
