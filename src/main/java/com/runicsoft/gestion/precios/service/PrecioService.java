package com.runicsoft.gestion.precios.service;

import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.clientes.repository.ClienteRepository;
import com.runicsoft.gestion.precios.dtos.request.PrecioRequest;
import com.runicsoft.gestion.precios.dtos.response.PrecioResponse;
import com.runicsoft.gestion.precios.mapper.PrecioMapper;
import com.runicsoft.gestion.precios.model.Precio;
import com.runicsoft.gestion.precios.repository.PrecioRepository;
import com.runicsoft.gestion.productos.model.Producto;
import com.runicsoft.gestion.productos.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PrecioService {

    private final PrecioRepository precioRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;
    private final PrecioMapper mapper;

    @Transactional(readOnly = true)
    public List<PrecioResponse> findAll() {
        return precioRepository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PrecioResponse findById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Ingresar un ID válido para poder continuar.");
        }

        Precio precio = precioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("El registro con el ID: " + id + " no existe"));

        return mapper.toResponse(precio);
    }

    @Transactional(readOnly = true)
    public List<PrecioResponse> findByClienteId(Long clienteId) {
        if (clienteId == null || clienteId <= 0) {
            throw new IllegalArgumentException("Ingresar un ID de cliente válido.");
        }

        return precioRepository.findByClienteId(clienteId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional
    public PrecioResponse save(PrecioRequest request) {
        validarRequest(request);

        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new IllegalArgumentException("El cliente no existe"));

        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new IllegalArgumentException("El producto no existe"));

        boolean existe = precioRepository.existsByClienteIdAndProductoIdAndTipoPrecio(
                cliente.getId(),
                producto.getId(),
                request.getTipoPrecio()
        );

        if (existe) {
            throw new IllegalArgumentException("El precio ya existe para este cliente y producto con ese tipo de precio.");
        }

        Precio precio = new Precio();
        precio.setCliente(cliente);
        precio.setProducto(producto);
        precio.setPrecio(request.getPrecio());
        precio.setTipoPrecio(request.getTipoPrecio());
        precio.setCantidadMinima(request.getCantidadMinima());

        Precio precioGuardado = precioRepository.save(precio);
        return mapper.toResponse(precioGuardado);
    }

    @Transactional
    public PrecioResponse update(Long id, PrecioRequest request) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Ingresar un ID válido para actualizar.");
        }

        validarRequest(request);

        Precio precioUpdate = precioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("El precio con ID " + id + " no existe"));

        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new IllegalArgumentException("El cliente no existe"));

        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new IllegalArgumentException("El producto no existe"));

        boolean existe = precioRepository.existsByClienteIdAndProductoIdAndTipoPrecioAndIdNot(
                cliente.getId(),
                producto.getId(),
                request.getTipoPrecio(),
                id
        );

        if (existe) {
            throw new IllegalArgumentException("Ya existe otro precio para este cliente y producto con ese tipo de precio.");
        }

        precioUpdate.setCliente(cliente);
        precioUpdate.setProducto(producto);
        precioUpdate.setPrecio(request.getPrecio());
        precioUpdate.setTipoPrecio(request.getTipoPrecio());
        precioUpdate.setCantidadMinima(request.getCantidadMinima());

        Precio precioActualizado = precioRepository.save(precioUpdate);
        return mapper.toResponse(precioActualizado);
    }

    @Transactional
    public void delete(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Ingresar un ID válido para eliminar.");
        }

        Precio precio = precioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("El precio con ID " + id + " no existe"));

        precioRepository.delete(precio);
    }

    private void validarRequest(PrecioRequest request) {
        if (request.getClienteId() == null || request.getClienteId() <= 0) {
            throw new IllegalArgumentException("Ingresar un ID de cliente válido.");
        }

        if (request.getProductoId() == null || request.getProductoId() <= 0) {
            throw new IllegalArgumentException("Ingresar un ID de producto válido.");
        }

        if (request.getPrecio() == null || request.getPrecio().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a cero.");
        }

        if (request.getTipoPrecio() == null) {
            throw new IllegalArgumentException("Debe seleccionar un tipo de precio.");
        }

        if (request.getCantidadMinima() == null || request.getCantidadMinima() <= 0) {
            throw new IllegalArgumentException("La cantidad mínima debe ser mayor a cero.");
        }
    }
}
