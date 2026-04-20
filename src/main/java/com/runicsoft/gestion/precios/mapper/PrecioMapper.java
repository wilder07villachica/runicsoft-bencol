package com.runicsoft.gestion.precios.mapper;

import com.runicsoft.gestion.precios.dtos.response.PrecioResponse;
import com.runicsoft.gestion.precios.model.Precio;
import org.springframework.stereotype.Component;

@Component
public class PrecioMapper {

    public PrecioResponse toResponse(Precio precio) {
        return new PrecioResponse(
                precio.getId(),
                precio.getCliente() != null ? precio.getCliente().getId() : null,
                precio.getCliente() != null ? precio.getCliente().getNombre() : null,
                precio.getProducto() != null ? precio.getProducto().getId() : null,
                precio.getProducto() != null ? precio.getProducto().getTipoProducto() : null,
                precio.getPrecio(),
                precio.getTipoPrecio(),
                precio.getCantidadMinima(),
                precio.getFechaCreacion()
        );
    }
}
