package com.runicsoft.gestion.finanzas.cuentas.service;

import com.runicsoft.gestion.finanzas.cajas.model.Caja;
import com.runicsoft.gestion.finanzas.cajas.repository.CajaRepository;
import com.runicsoft.gestion.finanzas.cuentas.dtos.request.AbonoCuentaPorCobrarRequest;
import com.runicsoft.gestion.finanzas.cuentas.dtos.request.ActualizarCuentaPorCobrarRequest;
import com.runicsoft.gestion.finanzas.cuentas.dtos.response.CuentaPorCobrarResponse;
import com.runicsoft.gestion.finanzas.cuentas.model.AbonoCuentaPorCobrar;
import com.runicsoft.gestion.finanzas.cuentas.model.CuentaPorCobrar;
import com.runicsoft.gestion.finanzas.cuentas.repository.AbonoCuentaPorCobrarRepository;
import com.runicsoft.gestion.finanzas.cuentas.repository.CuentaPorCobrarRepository;
import com.runicsoft.gestion.finanzas.movimientos.model.MovimientoCaja;
import com.runicsoft.gestion.finanzas.movimientos.repository.MovimientoCajaRepository;
import com.runicsoft.gestion.finanzas.shared.EstadoCuentaCobrar;
import com.runicsoft.gestion.finanzas.shared.OrigenMovimientoCaja;
import com.runicsoft.gestion.finanzas.shared.TipoMovimientoCaja;
import com.runicsoft.gestion.ventas.model.Venta;
import com.runicsoft.gestion.ventas.repository.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CuentaPorCobrarService {

    private final CuentaPorCobrarRepository cuentaPorCobrarRepository;
    private final AbonoCuentaPorCobrarRepository abonoRepository;
    private final CajaRepository cajaRepository;
    private final MovimientoCajaRepository movimientoCajaRepository;
    private final VentaRepository ventaRepository;

    @Transactional(readOnly = true)
    public List<CuentaPorCobrarResponse> listar() {
        return cuentaPorCobrarRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CuentaPorCobrarResponse> listarPorCliente(Long clienteId) {
        return cuentaPorCobrarRepository.findByClienteId(clienteId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CuentaPorCobrarResponse> listarPorEstado(EstadoCuentaCobrar estado) {
        return cuentaPorCobrarRepository.findByEstado(estado)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CuentaPorCobrarResponse buscarPorId(Long cuentaId) {
        CuentaPorCobrar cuenta = cuentaPorCobrarRepository.findById(cuentaId)
                .orElseThrow(() -> new IllegalArgumentException("La cuenta por cobrar no existe."));

        return toResponse(cuenta);
    }

    @Transactional
    public CuentaPorCobrarResponse actualizar(Long cuentaId, ActualizarCuentaPorCobrarRequest request) {
        CuentaPorCobrar cuenta = cuentaPorCobrarRepository.findById(cuentaId)
                .orElseThrow(() -> new IllegalArgumentException("La cuenta por cobrar no existe."));

        if (request.getFechaVencimiento() != null) {
            cuenta.setFechaVencimiento(request.getFechaVencimiento());
        }

        if (request.getEstado() != null) {
            if (cuenta.getSaldoPendiente().compareTo(BigDecimal.ZERO) > 0
                    && request.getEstado() == EstadoCuentaCobrar.PAGADA) {
                throw new IllegalArgumentException("No puedes marcar como pagada una cuenta con saldo pendiente.");
            }

            cuenta.setEstado(request.getEstado());
        }

        CuentaPorCobrar cuentaActualizada = cuentaPorCobrarRepository.save(cuenta);

        return toResponse(cuentaActualizada);
    }

    @Transactional
    public void registrarAbono(Long cuentaId, AbonoCuentaPorCobrarRequest request) {
        CuentaPorCobrar cuenta = cuentaPorCobrarRepository.findById(cuentaId)
                .orElseThrow(() -> new IllegalArgumentException("La cuenta por cobrar no existe."));

        Caja caja = cajaRepository.findById(request.getCajaId())
                .orElseThrow(() -> new IllegalArgumentException("La caja no existe."));

        if (request.getMonto() == null || request.getMonto().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El monto del abono debe ser mayor a cero.");
        }

        if (request.getMonto().compareTo(cuenta.getSaldoPendiente()) > 0) {
            throw new IllegalArgumentException("El abono no puede ser mayor al saldo pendiente.");
        }

        AbonoCuentaPorCobrar abono = new AbonoCuentaPorCobrar();
        abono.setCuentaPorCobrar(cuenta);
        abono.setCaja(caja);
        abono.setMonto(request.getMonto());
        abono.setMetodoPago(request.getMetodoPago());
        abono.setReferencia(request.getReferencia());
        abono.setObservacion(request.getObservacion());
        abonoRepository.save(abono);

        MovimientoCaja movimiento = new MovimientoCaja();
        movimiento.setCaja(caja);
        movimiento.setTipo(TipoMovimientoCaja.INGRESO);
        movimiento.setOrigen(OrigenMovimientoCaja.ABONO_CUENTA_COBRAR);
        movimiento.setMonto(request.getMonto());
        movimiento.setMetodoPago(request.getMetodoPago());
        movimiento.setReferencia("Abono CxC #" + cuenta.getId());
        movimiento.setObservacion("Abono registrado a cuenta por cobrar.");
        movimiento.setCliente(cuenta.getCliente());
        movimiento.setVenta(cuenta.getVenta());
        movimientoCajaRepository.save(movimiento);

        caja.setSaldoActual(caja.getSaldoActual().add(request.getMonto()));
        cajaRepository.save(caja);

        BigDecimal nuevoMontoPagado = cuenta.getMontoPagado().add(request.getMonto());
        BigDecimal nuevoSaldo = cuenta.getSaldoPendiente().subtract(request.getMonto());

        cuenta.setMontoPagado(nuevoMontoPagado);
        cuenta.setSaldoPendiente(nuevoSaldo);

        Venta venta = cuenta.getVenta();
        if (venta != null) {
            BigDecimal cantidadPagadaActual = venta.getCantidadPagada() != null
                    ? venta.getCantidadPagada()
                    : BigDecimal.ZERO;
            venta.setCantidadPagada(cantidadPagadaActual.add(request.getMonto()));
            venta.calcularTipoPago();
            ventaRepository.save(venta);
        }

        if (nuevoSaldo.compareTo(BigDecimal.ZERO) == 0) {
            cuenta.setEstado(EstadoCuentaCobrar.PAGADA);
        } else {
            cuenta.setEstado(EstadoCuentaCobrar.PARCIAL);
        }

        cuentaPorCobrarRepository.save(cuenta);
    }

    private CuentaPorCobrarResponse toResponse(CuentaPorCobrar cuenta) {
        return CuentaPorCobrarResponse.builder()
                .id(cuenta.getId())
                .ventaId(cuenta.getVenta() != null ? cuenta.getVenta().getId() : null)
                .clienteId(cuenta.getCliente() != null ? cuenta.getCliente().getId() : null)
                .clienteNombre(cuenta.getCliente() != null ? cuenta.getCliente().getNombre() : null)
                .montoTotal(cuenta.getMontoTotal())
                .montoPagado(cuenta.getMontoPagado())
                .saldoPendiente(cuenta.getSaldoPendiente())
                .estado(cuenta.getEstado())
                .fechaVencimiento(cuenta.getFechaVencimiento())
                .fechaCreacion(cuenta.getFechaCreacion())
                .build();
    }
}