package com.runicsoft.gestion.ventas.service;

import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.clientes.repository.ClienteRepository;
import com.runicsoft.gestion.precios.model.Precio;
import com.runicsoft.gestion.precios.repository.PrecioCategoriaRepository;
import com.runicsoft.gestion.precios.repository.PrecioRepository;
import com.runicsoft.gestion.productos.model.Producto;
import com.runicsoft.gestion.productos.repository.ProductoRepository;
import com.runicsoft.gestion.utils.TipoPago;
import com.runicsoft.gestion.ventas.dtos.request.VentaRequest;
import com.runicsoft.gestion.ventas.dtos.response.VentaResponse;
import com.runicsoft.gestion.ventas.dtos.response.VentaResumenResponse;
import com.runicsoft.gestion.ventas.mapper.VentaMapper;
import com.runicsoft.gestion.ventas.model.DetalleVenta;
import com.runicsoft.gestion.ventas.model.Venta;
import com.runicsoft.gestion.ventas.repository.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;
    private final PrecioRepository precioRepository;
    private final VentaMapper ventaMapper;

    @Transactional(readOnly = true)
    public List<VentaResumenResponse> findAll() {
        return ventaRepository.findAll()
                .stream()
                .map(ventaMapper::toResumenResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public VentaResponse findById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Ingresar un ID valido para poder continuar.");
        }
        Venta venta = ventaRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("El registro con el ID: " + id + " no existe")
        );
        return ventaMapper.toResponse(venta);
    }

    @Transactional
    public VentaResponse save(VentaRequest request) {
        if (request.getClienteId() == null || request.getClienteId() <= 0) {
            throw new IllegalArgumentException("Debe proporcionar un ID de cliente válido.");
        }

        if (request.getDetalleVentas() == null || request.getDetalleVentas().isEmpty()) {
            throw new IllegalArgumentException("Toda venta debe tener al menos un detalle asociado.");
        }

        Venta venta = ventaMapper.toEntity(request);

        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "El cliente con el ID: " + request.getClienteId() + " no existe"
                ));

        venta.setCliente(cliente);

        if (venta.getCantidadPagada() == null) {
            venta.setCantidadPagada(BigDecimal.ZERO);
        }

        BigDecimal total = BigDecimal.ZERO;

        for (DetalleVenta detalle : venta.getDetalleVentas()) {
            if (detalle.getProducto() == null || detalle.getProducto().getId() == null || detalle.getProducto().getId() <= 0) {
                throw new IllegalArgumentException("Cada detalle debe tener un producto válido.");
            }

            if (detalle.getCantidad() == null || detalle.getCantidad() <= 0) {
                throw new IllegalArgumentException("La cantidad de cada producto debe ser mayor a cero.");
            }

            Producto producto = productoRepository.findById(detalle.getProducto().getId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "El producto con el ID: " + detalle.getProducto().getId() + " no existe"
                    ));

            BigDecimal precioUnitario = precioRepository.findByClienteAndProducto(cliente, producto)
                    .map(Precio::getPrecio)
                    .orElse(producto.getPrecio());

            BigDecimal subtotal = precioUnitario.multiply(BigDecimal.valueOf(detalle.getCantidad()));

            detalle.setVenta(venta);
            detalle.setProducto(producto);
            detalle.setPrecioUnitario(precioUnitario);
            detalle.setSubtotal(subtotal);

            total = total.add(subtotal);
        }

        venta.setTotalPagar(total);
        venta.calcularTipoPago();

        Venta ventaGuardada = ventaRepository.save(venta);

        return ventaMapper.toResponse(ventaGuardada);
    }
}
