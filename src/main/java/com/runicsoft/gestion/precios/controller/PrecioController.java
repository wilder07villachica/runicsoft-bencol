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
@CrossOrigin
public class PrecioController {

    private final PrecioService precioService;

    @GetMapping
    public ResponseEntity<List<PrecioResponse>> findAll(){
        List<PrecioResponse> precios = precioService.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(precios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrecioResponse> findById(@PathVariable Long id){
        PrecioResponse precio = precioService.findById(id);
        return ResponseEntity.status(HttpStatus.OK).body(precio);
    }

    @PostMapping
    public ResponseEntity<PrecioResponse> save(@RequestBody PrecioRequest precio){
        PrecioResponse saved = precioService.save(precio);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
