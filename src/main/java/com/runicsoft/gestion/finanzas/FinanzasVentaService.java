package com.runicsoft.gestion.finanzas;

import com.runicsoft.gestion.finanzas.cajas.model.Caja;
import com.runicsoft.gestion.finanzas.cajas.repository.CajaRepository;
import com.runicsoft.gestion.finanzas.cuentas.model.CuentaPorCobrar;
import com.runicsoft.gestion.finanzas.cuentas.repository.CuentaPorCobrarRepository;
import com.runicsoft.gestion.finanzas.movimientos.model.MovimientoCaja;
import com.runicsoft.gestion.finanzas.movimientos.repository.MovimientoCajaRepository;
import com.runicsoft.gestion.finanzas.shared.EstadoCuentaCobrar;
import com.runicsoft.gestion.finanzas.shared.OrigenMovimientoCaja;
import com.runicsoft.gestion.finanzas.shared.TipoMovimientoCaja;
import com.runicsoft.gestion.ventas.model.Venta;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class FinanzasVentaService {

    private final CajaRepository cajaRepository;
    private final MovimientoCajaRepository movimientoCajaRepository;
    private final CuentaPorCobrarRepository cuentaPorCobrarRepository;

    @Transactional
    public void procesarImpactoFinanciero(Venta venta, Long cajaId) {
        if (venta == null) {
            throw new IllegalArgumentException("La venta no puede ser nula.");
        }

        BigDecimal total = venta.getTotalPagar();
        if (total == null || total.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("La venta debe tener un total válido mayor a cero.");
        }

        BigDecimal pagado = venta.getCantidadPagada() == null ? BigDecimal.ZERO : venta.getCantidadPagada();

        if (pagado.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("La cantidad pagada no puede ser negativa.");
        }

        if (pagado.compareTo(total) > 0) {
            throw new IllegalArgumentException("La cantidad pagada no puede ser mayor al total de la venta.");
        }

        if (pagado.compareTo(BigDecimal.ZERO) > 0 && venta.getMetodoPago() == null) {
            throw new IllegalArgumentException("Debe indicar el método de pago cuando exista un pago.");
        }

        if (pagado.compareTo(BigDecimal.ZERO) > 0) {
            if (cajaId == null || cajaId <= 0) {
                throw new IllegalArgumentException("Debe enviar una caja válida cuando exista un pago.");
            }

            Caja caja = cajaRepository.findById(cajaId)
                    .orElseThrow(() -> new IllegalArgumentException("La caja indicada no existe."));

            if (Boolean.FALSE.equals(caja.getActiva())) {
                throw new IllegalArgumentException("La caja indicada está inactiva.");
            }

            registrarIngresoCaja(caja, venta, pagado);
        }

        if (pagado.compareTo(total) < 0) {
            if (venta.getId() == null) {
                throw new IllegalArgumentException("La venta debe estar guardada antes de generar cuenta por cobrar.");
            }

            if (cuentaPorCobrarRepository.existsByVentaId(venta.getId())) {
                throw new IllegalArgumentException("La venta ya tiene una cuenta por cobrar registrada.");
            }

            crearCuentaPorCobrar(venta, total, pagado);
        }
    }

    private void registrarIngresoCaja(Caja caja, Venta venta, BigDecimal monto) {
        MovimientoCaja movimiento = new MovimientoCaja();
        movimiento.setCaja(caja);
        movimiento.setTipo(TipoMovimientoCaja.INGRESO);
        movimiento.setOrigen(OrigenMovimientoCaja.VENTA);
        movimiento.setMonto(monto);
        movimiento.setMetodoPago(venta.getMetodoPago());
        movimiento.setReferencia("Venta #" + venta.getId());
        movimiento.setObservacion("Ingreso generado automáticamente desde venta.");
        movimiento.setCliente(venta.getCliente());
        movimiento.setVenta(venta);

        movimientoCajaRepository.save(movimiento);

        BigDecimal saldoActual = caja.getSaldoActual() == null ? BigDecimal.ZERO : caja.getSaldoActual();
        caja.setSaldoActual(saldoActual.add(monto));
        cajaRepository.save(caja);
    }

    private void crearCuentaPorCobrar(Venta venta, BigDecimal total, BigDecimal pagado) {
        CuentaPorCobrar cuenta = new CuentaPorCobrar();
        cuenta.setVenta(venta);
        cuenta.setCliente(venta.getCliente());
        cuenta.setMontoTotal(total);
        cuenta.setMontoPagado(pagado);
        cuenta.setSaldoPendiente(total.subtract(pagado));

        if (pagado.compareTo(BigDecimal.ZERO) == 0) {
            cuenta.setEstado(EstadoCuentaCobrar.PENDIENTE);
        } else {
            cuenta.setEstado(EstadoCuentaCobrar.PARCIAL);
        }

        cuentaPorCobrarRepository.save(cuenta);
    }
}