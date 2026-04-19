package com.runicsoft.gestion.productos.service;

import com.runicsoft.gestion.productos.dtos.request.ProductoRequest;
import com.runicsoft.gestion.productos.dtos.response.ProductoResponse;
import com.runicsoft.gestion.productos.mapper.ProductoMapper;
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
    private final ProductoMapper mapper;

    @Transactional(readOnly = true)
    public List<ProductoResponse> findAll() {
        return productoRepository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductoResponse findById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Ingresar un ID valido para poder continuar.");
        }
        Producto producto = productoRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("El registro con el ID: " +  id + " no existe")
        );
        return mapper.toResponse(producto);
    }

    @Transactional
    public ProductoResponse save(ProductoRequest request) {
        if (request.getPrecio() == null || request.getPrecio().intValue() <= 0) {
            throw new IllegalArgumentException("Se debe asignar un precio de venta para cada producto registrado.");
        }
        Producto producto = mapper.toEntity(request);
        Producto productoGuardado = productoRepository.save(producto);
        return mapper.toResponse(productoGuardado);
    }

    @Transactional
    public ProductoResponse update(Long id, ProductoRequest request) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID inválido");
        }
        Producto productoUpdate = productoRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("El registro con el ID: " +  id + " no existe")
        );
        mapper.updateEntityFromRequest(request, productoUpdate);
        Producto productoActualizado = productoRepository.save(productoUpdate);
        return mapper.toResponse(productoActualizado);
    }
}
