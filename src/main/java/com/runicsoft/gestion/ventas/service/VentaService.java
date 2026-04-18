package com.runicsoft.gestion.ventas.service;

import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.clientes.repository.ClienteRepository;
import com.runicsoft.gestion.precios.model.Precio;
import com.runicsoft.gestion.precios.repository.PrecioCategoriaRepository;
import com.runicsoft.gestion.precios.repository.PrecioRepository;
import com.runicsoft.gestion.productos.model.Producto;
import com.runicsoft.gestion.productos.repository.ProductoRepository;
import com.runicsoft.gestion.utils.TipoPago;
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
    private final PrecioCategoriaRepository precioCategoriaRepository;

    @Transactional(readOnly = true)
    public List<Venta> findAll() {
        return ventaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Venta findById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Ingresar un ID valido para poder continuar.");
        }
        return ventaRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("El registro con el ID: " +  id + " no existe")
        );
    }

    @Transactional
    public Venta save(Venta venta) {
        if (venta.getCliente() == null || venta.getCliente().getId() == null) {
            throw new IllegalArgumentException("Debe proporcionar un cliente asociado a la venta.");
        }
        if (venta.getDetalleVentas() == null || venta.getDetalleVentas().isEmpty()) {
            throw  new  IllegalArgumentException("Toda venta debe tener un detalle asociado.");
        }
        if (venta.getTipoPago() == null) {
            throw new   IllegalArgumentException("Debe proporcionar un tipo de pago.");
        }

        Cliente cliente = clienteRepository.findById(venta.getCliente().getId()).orElseThrow(
                () -> new IllegalArgumentException("El cliente con el ID: " +   venta.getCliente().getId() + " no existe")
        );
        venta.setCliente(cliente);

        BigDecimal subtotal = BigDecimal.ZERO;
        for (DetalleVenta detalle : venta.getDetalleVentas()) {

            Producto producto = productoRepository.findById(detalle.getProducto().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no existe"));

            BigDecimal precioUnitario = precioRepository.findByClienteAndProducto(cliente, producto)
                    .map(Precio::getPrecio)
                    .orElse(producto.getPrecio());

            BigDecimal monto = precioUnitario.multiply(BigDecimal.valueOf(detalle.getCantidad()));

            detalle.setVenta(venta);
            detalle.setProducto(producto);
            detalle.setPrecioUnitario(precioUnitario);
            detalle.setSubtotal(monto);

            subtotal = subtotal.add(monto);
        }

        venta.setTotalPagar(subtotal);
        venta.calcularTipoPago();

        return  ventaRepository.save(venta);
    }
}
