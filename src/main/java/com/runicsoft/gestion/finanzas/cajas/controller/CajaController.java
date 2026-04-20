package com.runicsoft.gestion.finanzas.cajas.controller;

import com.runicsoft.gestion.finanzas.cajas.dtos.request.CajaRequest;
import com.runicsoft.gestion.finanzas.cajas.dtos.response.CajaResponse;
import com.runicsoft.gestion.finanzas.cajas.service.CajaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cajas")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CajaController {

    private final CajaService cajaService;

    @GetMapping
    public ResponseEntity<List<CajaResponse>> findAll() {
        List<CajaResponse> cajas = cajaService.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(cajas);
    }

    @GetMapping("/activas")
    public ResponseEntity<List<CajaResponse>> findActivas() {
        List<CajaResponse> cajas = cajaService.findActivas();
        return ResponseEntity.status(HttpStatus.OK).body(cajas);
    }

    @GetMapping("/principal")
    public ResponseEntity<CajaResponse> findPrincipal() {
        CajaResponse caja = cajaService.findPrincipal();
        return ResponseEntity.status(HttpStatus.OK).body(caja);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CajaResponse> findById(@PathVariable Long id) {
        CajaResponse caja = cajaService.findById(id);
        return ResponseEntity.status(HttpStatus.OK).body(caja);
    }

    @PostMapping
    public ResponseEntity<CajaResponse> save(@RequestBody CajaRequest caja) {
        CajaResponse saved = cajaService.save(caja);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CajaResponse> update(@PathVariable Long id, @RequestBody CajaRequest caja) {
        CajaResponse updated = cajaService.update(id, caja);
        return ResponseEntity.status(HttpStatus.OK).body(updated);
    }

    @PatchMapping("/{id}/activar")
    public ResponseEntity<CajaResponse> activar(@PathVariable Long id) {
        CajaResponse updated = cajaService.activar(id);
        return ResponseEntity.status(HttpStatus.OK).body(updated);
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<CajaResponse> desactivar(@PathVariable Long id) {
        CajaResponse updated = cajaService.desactivar(id);
        return ResponseEntity.status(HttpStatus.OK).body(updated);
    }

    @PatchMapping("/{id}/principal")
    public ResponseEntity<CajaResponse> marcarComoPrincipal(@PathVariable Long id) {
        CajaResponse updated = cajaService.marcarComoPrincipal(id);
        return ResponseEntity.status(HttpStatus.OK).body(updated);
    }
}