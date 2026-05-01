package com.runicsoft.gestion.clientes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.runicsoft.gestion.precios.model.Precio;
import com.runicsoft.gestion.utils.CategoriaCliente;
import com.runicsoft.gestion.utils.Estado;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "clientes")
@Data
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 250, nullable = false)
    private String nombre;

    @Column(length = 250, nullable = false)
    private String direccion;

    @Column(length = 250)
    private String correo;

    @Column(length = 20, nullable = false)
    private String telefono;

    @Enumerated(EnumType.STRING)
    private CategoriaCliente categoria = CategoriaCliente.CONSUMIDOR_FINAL;

    @Enumerated(EnumType.STRING)
    private Estado estado = Estado.ACTIVO;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Precio>  precios;
}
