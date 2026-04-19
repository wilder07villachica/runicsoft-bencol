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
            throw new IllegalArgumentException("Ingresar un ID valido para poder continuar.");
        }
        Precio precio = precioRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("El registro con el ID: " +  id + " no existe")
        );
        return mapper.toResponse(precio);
    }

    @Transactional
    public PrecioResponse save(PrecioRequest request) {
        if (request.getCliente() == null || request.getCliente().getId() == null || request.getCliente().getId() <= 0) {
            throw new IllegalArgumentException("Ingresar un ID de cliente válido.");
        }
        if (request.getProducto() == null || request.getProducto().getId() == null || request.getProducto().getId() <= 0) {
            throw new IllegalArgumentException("Ingresar un ID de producto válido.");
        }
        Cliente clienteId = clienteRepository.findById(request.getCliente().getId()).orElseThrow(
                () -> new IllegalArgumentException("El cliente no existe")
        );
        Producto productoId= productoRepository.findById(request.getProducto().getId()).orElseThrow(
                () -> new IllegalArgumentException("El producto no existe")
        );
        boolean existe = precioRepository.existsByClienteIdAndProductoIdAndTipoPrecio(
                clienteId.getId(), productoId.getId(),  request.getTipoPrecio()
        );
        if (existe) {
            throw new IllegalArgumentException("El precio ya existe para este cliente y producto.");
        }
        Precio precio = mapper.toEntity(request);
        request.setCliente(clienteId);
        request.setProducto(productoId);
        Precio precioGuardado = precioRepository.save(precio);
        return mapper.toResponse(precioGuardado);
    }
}
