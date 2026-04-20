package com.runicsoft.gestion.finanzas.movimientos.controller;

import com.runicsoft.gestion.finanzas.movimientos.dtos.request.MovimientoCajaRequest;
import com.runicsoft.gestion.finanzas.movimientos.dtos.response.MovimientoCajaResponse;
import com.runicsoft.gestion.finanzas.movimientos.service.MovimientoCajaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movimientos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MovimientoCajaController {

    private final MovimientoCajaService movimientoCajaService;

    @GetMapping
    public ResponseEntity<List<MovimientoCajaResponse>> findAll() {
        List<MovimientoCajaResponse> movimientos = movimientoCajaService.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(movimientos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovimientoCajaResponse> findById(@PathVariable Long id) {
        MovimientoCajaResponse movimiento = movimientoCajaService.findById(id);
        return ResponseEntity.status(HttpStatus.OK).body(movimiento);
    }

    @GetMapping("/caja/{cajaId}")
    public ResponseEntity<List<MovimientoCajaResponse>> findByCajaId(@PathVariable Long cajaId) {
        List<MovimientoCajaResponse> movimientos = movimientoCajaService.findByCajaId(cajaId);
        return ResponseEntity.status(HttpStatus.OK).body(movimientos);
    }

    @PostMapping("/ingreso-manual")
    public ResponseEntity<MovimientoCajaResponse> registrarIngresoManual(@RequestBody MovimientoCajaRequest request) {
        MovimientoCajaResponse saved = movimientoCajaService.registrarIngresoManual(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/egreso-manual")
    public ResponseEntity<MovimientoCajaResponse> registrarEgresoManual(@RequestBody MovimientoCajaRequest request) {
        MovimientoCajaResponse saved = movimientoCajaService.registrarEgresoManual(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}