package com.runicsoft.gestion.finanzas.cuentas.dtos.response;

import com.runicsoft.gestion.finanzas.shared.EstadoCuentaCobrar;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CuentaPorCobrarResponse {
    private Long id;
    private Long ventaId;
    private Long clienteId;
    private String clienteNombre;
    private BigDecimal montoTotal;
    private BigDecimal montoPagado;
    private BigDecimal saldoPendiente;
    private EstadoCuentaCobrar estado;
    private LocalDate fechaVencimiento;
    private LocalDateTime fechaCreacion;
}
