package com.runicsoft.gestion.precios.controller;

import com.runicsoft.gestion.precios.dtos.request.PrecioRequest;
import com.runicsoft.gestion.precios.dtos.response.PrecioResponse;
import com.runicsoft.gestion.precios.model.Precio;
import com.runicsoft.gestion.precios.service.PrecioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/precios")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PrecioController {

    private final PrecioService precioService;

    @GetMapping
    public ResponseEntity<List<PrecioResponse>> findAll() {
        return ResponseEntity.ok(precioService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrecioResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(precioService.findById(id));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<PrecioResponse>> findByClienteId(@PathVariable Long clienteId) {
        return ResponseEntity.ok(precioService.findByClienteId(clienteId));
    }

    @PostMapping
    public ResponseEntity<PrecioResponse> save(@RequestBody PrecioRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(precioService.save(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrecioResponse> update(@PathVariable Long id, @RequestBody PrecioRequest request) {
        return ResponseEntity.ok(precioService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        precioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
