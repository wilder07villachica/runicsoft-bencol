package com.runicsoft.gestion.precios.controller;

import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.precios.service.PrecioCategoriaService;
import com.runicsoft.gestion.productos.model.Producto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/precio-categoria")
@RequiredArgsConstructor
@CrossOrigin
public class PrecioCategoriaController {

    private final PrecioCategoriaService precioCategoriaService;

    @GetMapping
    public ResponseEntity<BigDecimal> obtenerPrecio(@RequestParam Cliente cliente, @RequestParam Producto producto){
        BigDecimal precio = precioCategoriaService.obtenerPrecio(cliente, producto);
        return ResponseEntity.status(HttpStatus.OK).body(precio);
    }
}