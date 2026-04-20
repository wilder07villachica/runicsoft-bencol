package com.runicsoft.gestion.finanzas.movimientos.service;

import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.clientes.repository.ClienteRepository;
import com.runicsoft.gestion.finanzas.cajas.model.Caja;
import com.runicsoft.gestion.finanzas.cajas.repository.CajaRepository;
import com.runicsoft.gestion.finanzas.movimientos.dtos.request.MovimientoCajaRequest;
import com.runicsoft.gestion.finanzas.movimientos.dtos.response.MovimientoCajaResponse;
import com.runicsoft.gestion.finanzas.movimientos.model.MovimientoCaja;
import com.runicsoft.gestion.finanzas.movimientos.repository.MovimientoCajaRepository;
import com.runicsoft.gestion.finanzas.shared.OrigenMovimientoCaja;
import com.runicsoft.gestion.finanzas.shared.TipoMovimientoCaja;
import com.runicsoft.gestion.ventas.model.Venta;
import com.runicsoft.gestion.ventas.repository.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MovimientoCajaService {

    private final MovimientoCajaRepository movimientoCajaRepository;
    private final CajaRepository cajaRepository;
    private final ClienteRepository clienteRepository;
    private final VentaRepository ventaRepository;

    @Transactional(readOnly = true)
    public List<MovimientoCajaResponse> findAll() {
        return movimientoCajaRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(MovimientoCaja::getFecha).reversed())
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public MovimientoCajaResponse findById(Long id) {
        return toResponse(findEntityById(id));
    }

    @Transactional(readOnly = true)
    public List<MovimientoCajaResponse> findByCajaId(Long cajaId) {
        if (cajaId == null || cajaId <= 0) {
            throw new IllegalArgumentException("Debe proporcionar un ID de caja válido.");
        }

        if (!cajaRepository.existsById(cajaId)) {
            throw new IllegalArgumentException("La caja con ID " + cajaId + " no existe.");
        }

        return movimientoCajaRepository.findByCajaIdOrderByFechaDesc(cajaId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public MovimientoCajaResponse registrarIngresoManual(MovimientoCajaRequest request) {
        validarRequestBase(request);

        if (request.getTipo() != TipoMovimientoCaja.INGRESO) {
            throw new IllegalArgumentException("El tipo de movimiento debe ser INGRESO.");
        }

        if (request.getOrigen() == null) {
            request.setOrigen(OrigenMovimientoCaja.INGRESO_MANUAL);
        }

        if (request.getOrigen() != OrigenMovimientoCaja.INGRESO_MANUAL
                && request.getOrigen() != OrigenMovimientoCaja.AJUSTE
                && request.getOrigen() != OrigenMovimientoCaja.APERTURA_CAJA) {
            throw new IllegalArgumentException("El origen no es válido para un ingreso manual.");
        }

        if (request.getCategoriaEgreso() != null) {
            throw new IllegalArgumentException("La categoría de egreso solo aplica para movimientos de tipo EGRESO.");
        }

        Caja caja = findCajaActiva(request.getCajaId());
        Cliente cliente = findClienteIfPresent(request.getClienteId());
        Venta venta = findVentaIfPresent(request.getVentaId());

        MovimientoCaja movimiento = new MovimientoCaja();
        movimiento.setCaja(caja);
        movimiento.setTipo(TipoMovimientoCaja.INGRESO);
        movimiento.setOrigen(request.getOrigen());
        movimiento.setCategoriaEgreso(null);
        movimiento.setMonto(request.getMonto());
        movimiento.setMetodoPago(request.getMetodoPago());
        movimiento.setReferencia(limpiarTexto(request.getReferencia()));
        movimiento.setObservacion(limpiarTexto(request.getObservacion()));
        movimiento.setCliente(cliente);
        movimiento.setVenta(venta);

        MovimientoCaja guardado = movimientoCajaRepository.save(movimiento);

        BigDecimal saldoActual = caja.getSaldoActual() == null ? BigDecimal.ZERO : caja.getSaldoActual();
        caja.setSaldoActual(saldoActual.add(request.getMonto()));
        cajaRepository.save(caja);

        return toResponse(guardado);
    }

    @Transactional
    public MovimientoCajaResponse registrarEgresoManual(MovimientoCajaRequest request) {
        validarRequestBase(request);

        if (request.getTipo() != TipoMovimientoCaja.EGRESO) {
            throw new IllegalArgumentException("El tipo de movimiento debe ser EGRESO.");
        }

        if (request.getOrigen() == null) {
            request.setOrigen(OrigenMovimientoCaja.EGRESO_MANUAL);
        }

        if (request.getOrigen() != OrigenMovimientoCaja.EGRESO_MANUAL
                && request.getOrigen() != OrigenMovimientoCaja.AJUSTE
                && request.getOrigen() != OrigenMovimientoCaja.CIERRE_CAJA) {
            throw new IllegalArgumentException("El origen no es válido para un egreso manual.");
        }

        if (request.getCategoriaEgreso() == null) {
            throw new IllegalArgumentException("Debe indicar una categoría de egreso.");
        }

        Caja caja = findCajaActiva(request.getCajaId());
        Cliente cliente = findClienteIfPresent(request.getClienteId());
        Venta venta = findVentaIfPresent(request.getVentaId());

        BigDecimal saldoActual = caja.getSaldoActual() == null ? BigDecimal.ZERO : caja.getSaldoActual();

        if (saldoActual.compareTo(request.getMonto()) < 0) {
            throw new IllegalArgumentException("La caja no tiene saldo suficiente para registrar el egreso.");
        }

        MovimientoCaja movimiento = new MovimientoCaja();
        movimiento.setCaja(caja);
        movimiento.setTipo(TipoMovimientoCaja.EGRESO);
        movimiento.setOrigen(request.getOrigen());
        movimiento.setCategoriaEgreso(request.getCategoriaEgreso());
        movimiento.setMonto(request.getMonto());
        movimiento.setMetodoPago(request.getMetodoPago());
        movimiento.setReferencia(limpiarTexto(request.getReferencia()));
        movimiento.setObservacion(limpiarTexto(request.getObservacion()));
        movimiento.setCliente(cliente);
        movimiento.setVenta(venta);

        MovimientoCaja guardado = movimientoCajaRepository.save(movimiento);

        caja.setSaldoActual(saldoActual.subtract(request.getMonto()));
        cajaRepository.save(caja);

        return toResponse(guardado);
    }

    private void validarRequestBase(MovimientoCajaRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("La solicitud no puede ser nula.");
        }

        if (request.getCajaId() == null || request.getCajaId() <= 0) {
            throw new IllegalArgumentException("Debe proporcionar una caja válida.");
        }

        if (request.getTipo() == null) {
            throw new IllegalArgumentException("Debe indicar el tipo de movimiento.");
        }

        if (request.getMonto() == null || request.getMonto().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El monto debe ser mayor a cero.");
        }
    }

    private Caja findCajaActiva(Long cajaId) {
        Caja caja = cajaRepository.findById(cajaId)
                .orElseThrow(() -> new IllegalArgumentException("La caja indicada no existe."));

        if (Boolean.FALSE.equals(caja.getActiva())) {
            throw new IllegalArgumentException("La caja indicada está inactiva.");
        }

        return caja;
    }

    private Cliente findClienteIfPresent(Long clienteId) {
        if (clienteId == null) {
            return null;
        }

        return clienteRepository.findById(clienteId)
                .orElseThrow(() -> new IllegalArgumentException("El cliente con ID " + clienteId + " no existe."));
    }

    private Venta findVentaIfPresent(Long ventaId) {
        if (ventaId == null) {
            return null;
        }

        return ventaRepository.findById(ventaId)
                .orElseThrow(() -> new IllegalArgumentException("La venta con ID " + ventaId + " no existe."));
    }

    private MovimientoCaja findEntityById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Debe proporcionar un ID de movimiento válido.");
        }

        return movimientoCajaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("El movimiento con ID " + id + " no existe."));
    }

    private String limpiarTexto(String texto) {
        if (texto == null || texto.trim().isEmpty()) {
            return null;
        }
        return texto.trim();
    }

    private MovimientoCajaResponse toResponse(MovimientoCaja movimiento) {
        return new MovimientoCajaResponse(
                movimiento.getId(),
                movimiento.getCaja() != null ? movimiento.getCaja().getId() : null,
                movimiento.getCaja() != null ? movimiento.getCaja().getNombre() : null,
                movimiento.getTipo(),
                movimiento.getCategoriaEgreso(),
                movimiento.getOrigen(),
                movimiento.getMonto(),
                movimiento.getMetodoPago(),
                movimiento.getReferencia(),
                movimiento.getObservacion(),
                movimiento.getCliente() != null ? movimiento.getCliente().getId() : null,
                movimiento.getCliente() != null ? movimiento.getCliente().getNombre() : null,
                movimiento.getVenta() != null ? movimiento.getVenta().getId() : null,
                movimiento.getFecha()
        );
    }
}