package com.runicsoft.gestion.ventas.controller;

import com.runicsoft.gestion.ventas.dtos.request.VentaRequest;
import com.runicsoft.gestion.ventas.dtos.response.VentaResponse;
import com.runicsoft.gestion.ventas.dtos.response.VentaResumenResponse;
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
@CrossOrigin(origins = "http://localhost:5173")
public class VentaController {

    private final VentaService ventaService;

    @GetMapping
    public ResponseEntity<List<VentaResumenResponse>> findAll(){
        List<VentaResumenResponse> ventas = ventaService.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(ventas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VentaResponse> findById(@PathVariable Long id){
        VentaResponse venta = ventaService.findById(id);
        return ResponseEntity.status(HttpStatus.OK).body(venta);
    }

    @PostMapping
    public ResponseEntity<VentaResponse> save(@RequestBody VentaRequest venta){
        VentaResponse saved = ventaService.save(venta);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}