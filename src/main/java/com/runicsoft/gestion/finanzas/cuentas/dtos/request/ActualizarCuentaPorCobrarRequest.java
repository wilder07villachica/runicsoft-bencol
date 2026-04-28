package com.runicsoft.gestion.finanzas.cuentas.dtos.request;

import com.runicsoft.gestion.finanzas.shared.EstadoCuentaCobrar;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

@RequiredArgsConstructor
@Getter
public class ActualizarCuentaPorCobrarRequest {
    private LocalDate fechaVencimiento;
    private EstadoCuentaCobrar estado;
}
