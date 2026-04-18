package com.runicsoft.gestion.ventas.controller;

import com.runicsoft.gestion.ventas.model.Venta;
import com.runicsoft.gestion.ventas.service.VentaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ventas")
@RequiredArgsConstructor
@CrossOrigin
public class VentaController {

    private final VentaService ventaService;

    @GetMapping
    public ResponseEntity<List<Venta>> findAll(){
        List<Venta> ventas = ventaService.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(ventas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venta> findById(@PathVariable Long id){
        Venta venta = ventaService.findById(id);
        return ResponseEntity.status(HttpStatus.OK).body(venta);
    }

    @PostMapping
    public ResponseEntity<Venta> save(@RequestBody Venta venta){
        Venta saved = ventaService.save(venta);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}