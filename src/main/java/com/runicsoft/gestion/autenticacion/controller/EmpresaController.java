package com.runicsoft.gestion.autenticacion.controller;

import com.runicsoft.gestion.autenticacion.dtos.request.EmpresaRequest;
import com.runicsoft.gestion.autenticacion.dtos.response.EmpresaResponse;
import com.runicsoft.gestion.autenticacion.service.EmpresaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/empresa")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "https://runicsoft-bencol-g2iytkooh-wilders-projects-13f519b6.vercel.app"})
public class EmpresaController {

    private final EmpresaService empresaService;

    @GetMapping("/me")
    public EmpresaResponse obtenerMiEmpresa() {
        return empresaService.obtenerMiEmpresa();
    }

    @PutMapping("/me")
    public EmpresaResponse actualizarMiEmpresa(@Valid @RequestBody EmpresaRequest request) {
        return empresaService.actualizarMiEmpresa(request);
    }
}