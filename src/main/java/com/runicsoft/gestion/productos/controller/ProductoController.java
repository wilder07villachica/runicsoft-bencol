package com.runicsoft.gestion.productos.controller;

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
    public ResponseEntity<List<Producto>> findAll(){
        List<Producto> productos = productoService.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(productos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> findById(@PathVariable Long id){
        Producto producto = productoService.findById(id);
        return ResponseEntity.status(HttpStatus.OK).body(producto);
    }

    @PostMapping
    public ResponseEntity<Producto> save(@RequestBody Producto producto){
        Producto saved = productoService.save(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> update(@PathVariable Long id, @RequestBody Producto producto){
        Producto updated = productoService.update(id, producto);
        return ResponseEntity.status(HttpStatus.OK).body(updated);
    }
}
