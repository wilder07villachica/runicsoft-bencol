package com.runicsoft.gestion.productos.mapper;

import com.runicsoft.gestion.productos.dtos.request.ProductoRequest;
import com.runicsoft.gestion.productos.dtos.response.ProductoResponse;
import com.runicsoft.gestion.productos.model.Producto;
import org.springframework.stereotype.Component;

@Component
public class ProductoMapper {

    public Producto toEntity(ProductoRequest request) {
        Producto producto = new Producto();
        producto.setTipoProducto(request.getTipo());
        producto.setPrecio(request.getPrecio());
        producto.setEstado(request.getEstado());
        return producto;
    }

    public ProductoResponse toResponse(Producto producto) {
        return new ProductoResponse(
                producto.getId(),
                producto.getTipoProducto(),
                producto.getPrecio(),
                producto.getEstado()
        );
    }

    public void updateEntityFromRequest(ProductoRequest request, Producto producto) {
        producto.setTipoProducto(request.getTipo());
        producto.setPrecio(request.getPrecio());
        producto.setEstado(request.getEstado());
    }
}
