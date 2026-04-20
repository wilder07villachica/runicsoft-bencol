package com.runicsoft.gestion.clientes.controller;

import com.runicsoft.gestion.clientes.dtos.request.ClienteRequest;
import com.runicsoft.gestion.clientes.dtos.response.ClienteResponse;
import com.runicsoft.gestion.clientes.model.Cliente;
import com.runicsoft.gestion.clientes.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping
    public ResponseEntity<List<ClienteResponse>> findAll() {
        List<ClienteResponse> clientes = clienteService.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(clientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponse> findById(@PathVariable Long id) {
        ClienteResponse cliente = clienteService.findById(id);
        return ResponseEntity.status(HttpStatus.OK).body(cliente);
    }

    @PostMapping
    public ResponseEntity<ClienteResponse> save(@RequestBody ClienteRequest cliente) {
        ClienteResponse saved = clienteService.save(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponse> update(@PathVariable Long id, @RequestBody ClienteRequest cliente) {
        ClienteResponse updated = clienteService.update(id, cliente);
        return ResponseEntity.status(HttpStatus.OK).body(updated);
    }
}
