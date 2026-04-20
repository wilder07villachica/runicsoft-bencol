package com.runicsoft.gestion.finanzas.cuentas.service;

import com.runicsoft.gestion.finanzas.cajas.model.Caja;
import com.runicsoft.gestion.finanzas.cajas.repository.CajaRepository;
import com.runicsoft.gestion.finanzas.cuentas.dtos.request.AbonoCuentaPorCobrarRequest;
import com.runicsoft.gestion.finanzas.cuentas.model.AbonoCuentaPorCobrar;
import com.runicsoft.gestion.finanzas.cuentas.model.CuentaPorCobrar;
import com.runicsoft.gestion.finanzas.cuentas.repository.AbonoCuentaPorCobrarRepository;
import com.runicsoft.gestion.finanzas.cuentas.repository.CuentaPorCobrarRepository;
import com.runicsoft.gestion.finanzas.movimientos.model.MovimientoCaja;
import com.runicsoft.gestion.finanzas.movimientos.repository.MovimientoCajaRepository;
import com.runicsoft.gestion.finanzas.shared.EstadoCuentaCobrar;
import com.runicsoft.gestion.finanzas.shared.OrigenMovimientoCaja;
import com.runicsoft.gestion.finanzas.shared.TipoMovimientoCaja;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CuentaPorCobrarService {

    private final CuentaPorCobrarRepository cuentaPorCobrarRepository;
    private final AbonoCuentaPorCobrarRepository abonoRepository;
    private final CajaRepository cajaRepository;
    private final MovimientoCajaRepository movimientoCajaRepository;

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

        if (nuevoSaldo.compareTo(BigDecimal.ZERO) == 0) {
            cuenta.setEstado(EstadoCuentaCobrar.PAGADA);
        } else {
            cuenta.setEstado(EstadoCuentaCobrar.PARCIAL);
        }

        cuentaPorCobrarRepository.save(cuenta);
    }
}