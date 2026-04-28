package com.runicsoft.gestion.finanzas.cuentas.controller;

import com.runicsoft.gestion.finanzas.cuentas.dtos.request.AbonoCuentaPorCobrarRequest;
import com.runicsoft.gestion.finanzas.cuentas.dtos.request.ActualizarCuentaPorCobrarRequest;
import com.runicsoft.gestion.finanzas.cuentas.dtos.response.CuentaPorCobrarResponse;
import com.runicsoft.gestion.finanzas.cuentas.service.CuentaPorCobrarService;
import com.runicsoft.gestion.finanzas.shared.EstadoCuentaCobrar;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/cuentas-por-cobrar")
@CrossOrigin(origins = "http://localhost:5173")
public class CuentaPorCobrarController {

    private final CuentaPorCobrarService cuentaPorCobrarService;

    @GetMapping
    public List<CuentaPorCobrarResponse> listar(@RequestParam(required = false) Long clienteId,
            @RequestParam(required = false) EstadoCuentaCobrar estado) {
        if (clienteId != null) {
            return cuentaPorCobrarService.listarPorCliente(clienteId);
        }
        if (estado != null) {
            return cuentaPorCobrarService.listarPorEstado(estado);
        }
        return cuentaPorCobrarService.listar();
    }

    @GetMapping("/{cuentaId}")
    public CuentaPorCobrarResponse buscarPorId(@PathVariable Long cuentaId) {
        return cuentaPorCobrarService.buscarPorId(cuentaId);
    }

    @PutMapping("/{cuentaId}")
    public CuentaPorCobrarResponse actualizar(@PathVariable Long cuentaId,
            @RequestBody ActualizarCuentaPorCobrarRequest request) {
        return cuentaPorCobrarService.actualizar(cuentaId, request);
    }

    @PostMapping("/{cuentaId}/abonos")
    public void registrarAbono(@PathVariable Long cuentaId,
            @RequestBody AbonoCuentaPorCobrarRequest request) {
        cuentaPorCobrarService.registrarAbono(cuentaId, request);
    }
}
