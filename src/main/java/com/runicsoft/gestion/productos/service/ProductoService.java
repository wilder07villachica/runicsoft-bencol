package com.runicsoft.gestion.productos.service;

import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.productos.model.Producto;
import com.runicsoft.gestion.productos.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    @Transactional(readOnly = true)
    public List<Producto> findAll() {
        return productoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Producto findById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Ingresar un ID valido para poder continuar.");
        }
        return productoRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("El registro con el ID: " +  id + " no existe")
        );
    }

    @Transactional
    public Producto save(Producto producto) {
        if (producto.getPrecio() == null || producto.getPrecio().intValue() <= 0) {
            throw new IllegalArgumentException("Se debe asignar un precio de venta para cada producto registrado.");
        }
        return productoRepository.save(producto);
    }

    @Transactional
    public Producto update(Long id, Producto producto) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID inválido");
        }
        Producto productoUpdate = productoRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("El registro con el ID: " +  id + " no existe")
        );
        productoUpdate.setTipoProducto(producto.getTipoProducto());
        productoUpdate.setPrecio(producto.getPrecio());
        productoUpdate.setEstado(producto.getEstado());
        return productoRepository.save(productoUpdate);
    }
}
