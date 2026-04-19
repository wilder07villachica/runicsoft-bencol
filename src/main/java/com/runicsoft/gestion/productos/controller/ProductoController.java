package com.runicsoft.gestion.productos.controller;

import com.runicsoft.gestion.productos.dtos.request.ProductoRequest;
import com.runicsoft.gestion.productos.dtos.response.ProductoResponse;
import com.runicsoft.gestion.productos.model.Producto;
import com.runicsoft.gestion.productos.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
@RequiredArgsConstructor
@CrossOrigin
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<ProductoResponse>> findAll(){
        List<ProductoResponse> productos = productoService.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(productos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponse> findById(@PathVariable Long id){
        ProductoResponse producto = productoService.findById(id);
        return ResponseEntity.status(HttpStatus.OK).body(producto);
    }

    @PostMapping
    public ResponseEntity<ProductoResponse> save(@RequestBody ProductoRequest producto){
        ProductoResponse saved = productoService.save(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponse> update(@PathVariable Long id, @RequestBody ProductoRequest producto){
        ProductoResponse updated = productoService.update(id, producto);
        return ResponseEntity.status(HttpStatus.OK).body(updated);
    }
}
