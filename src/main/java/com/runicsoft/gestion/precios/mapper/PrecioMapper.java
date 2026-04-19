package com.runicsoft.gestion.precios.mapper;

import com.runicsoft.gestion.precios.dtos.request.PrecioRequest;
import com.runicsoft.gestion.precios.dtos.response.PrecioResponse;
import com.runicsoft.gestion.precios.model.Precio;
import org.springframework.stereotype.Component;

@Component
public class PrecioMapper {

    public Precio toEntity(PrecioRequest request) {
        Precio precio = new Precio();
        precio.setCliente(request.getCliente());
        precio.setProducto(request.getProducto());
        precio.setPrecio(request.getPrecio());
        precio.setTipoPrecio(request.getTipoPrecio());
        precio.setCantidadMinima(request.getCantidadMinima());
        return precio;
    }

    public PrecioResponse toResponse(Precio precio) {
        return new PrecioResponse(
                precio.getCliente(),
                precio.getProducto(),
                precio.getPrecio()
        );
    }
}
