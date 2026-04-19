package com.runicsoft.gestion.ventas.mapper;

import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.productos.model.Producto;
import com.runicsoft.gestion.ventas.dtos.request.DetalleVentaRequest;
import com.runicsoft.gestion.ventas.dtos.request.VentaRequest;
import com.runicsoft.gestion.ventas.dtos.response.DetalleVentaResponse;
import com.runicsoft.gestion.ventas.dtos.response.VentaResponse;
import com.runicsoft.gestion.ventas.dtos.response.VentaResumenResponse;
import com.runicsoft.gestion.ventas.model.DetalleVenta;
import com.runicsoft.gestion.ventas.model.Venta;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class VentaMapper {

    public Venta toEntity(VentaRequest request) {
        Venta venta = new Venta();

        if (request.getClienteId() != null) {
            Cliente cliente = new Cliente();
            cliente.setId(request.getClienteId());
            venta.setCliente(cliente);
        }

        venta.setCantidadPagada(request.getCantidadPagada());
        venta.setMetodoPago(request.getMetodoPago());

        if (request.getDetalleVentas() != null && !request.getDetalleVentas().isEmpty()) {
            List<DetalleVenta> detalles = request.getDetalleVentas()
                    .stream()
                    .map(this::toDetalleEntity)
                    .collect(Collectors.toList());

            detalles.forEach(detalle -> detalle.setVenta(venta));
            venta.setDetalleVentas(detalles);
        }

        return venta;
    }

    public DetalleVenta toDetalleEntity(DetalleVentaRequest request) {
        DetalleVenta detalle = new DetalleVenta();

        if (request.getProductoId() != null) {
            Producto producto = new Producto();
            producto.setId(request.getProductoId());
            detalle.setProducto(producto);
        }

        detalle.setCantidad(request.getCantidad());

        return detalle;
    }

    public VentaResponse toResponse(Venta venta) {
        return new VentaResponse(
                venta.getId(),
                venta.getCliente() != null ? venta.getCliente().getId() : null,
                venta.getCliente() != null ? venta.getCliente().getNombre() : null,
                venta.getTotalPagar(),
                venta.getTipoPago(),
                venta.getCantidadPagada(),
                venta.getMetodoPago(),
                venta.getFechaCreacion(),
                venta.getEstadoVenta(),
                venta.getDetalleVentas() != null
                        ? venta.getDetalleVentas()
                        .stream()
                        .map(this::toDetalleResponse)
                        .collect(Collectors.toList())
                        : Collections.emptyList()
        );
    }

    public DetalleVentaResponse toDetalleResponse(DetalleVenta detalle) {
        return new DetalleVentaResponse(
                detalle.getId(),
                detalle.getProducto() != null ? detalle.getProducto().getId() : null,
                detalle.getProducto() != null ? detalle.getProducto().getTipoProducto() : null,
                detalle.getCantidad(),
                detalle.getPrecioUnitario(),
                detalle.getSubtotal()
        );
    }

    public VentaResumenResponse toResumenResponse(Venta venta) {
        return new VentaResumenResponse(
                venta.getId(),
                venta.getCliente() != null ? venta.getCliente().getId() : null,
                venta.getCliente() != null ? venta.getCliente().getNombre() : null,
                venta.getTotalPagar(),
                venta.getTipoPago(),
                venta.getCantidadPagada(),
                venta.getMetodoPago(),
                venta.getFechaCreacion(),
                venta.getEstadoVenta()
        );
    }
}
