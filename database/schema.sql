DROP
DATABASE IF EXISTS bencol_db;
CREATE
DATABASE bencol_db;

USE
bencol_db;

create table clientes
(
    id        bigint primary key not null auto_increment,
    nombre    varchar(250)       not null,
    direccion varchar(250)       not null,
    correo    varchar(250)       null unique,
    telefono  varchar(20)        not null,
    categoria enum('DISTRIBUIDOR', 'CONSUMIDOR_FINAL', 'CORPORATIVO') default 'CONSUMIDOR_FINAL',
    estado    enum('ACTIVO', 'INACTIVO') default 'ACTIVO'
);

create table productos
(
    id     bigint primary key not null auto_increment,
    tipo   enum('BIDON_20_LITROS', 'BOTELLA_650_MILILITROS', 'BOTELLA_1_LITRO', 'BOTELLA_2_5_LITROS') default 'BIDON_20_LITROS',
    precio decimal(10, 2)     not null check (precio > 0),
    estado enum('ACTIVO', 'INACTIVO') default 'ACTIVO'
);

create table precios
(
    id              bigint primary key not null auto_increment,
    cliente_id      bigint             not null,
    producto_id     bigint             not null,
    precio          decimal(10, 2)     not null check (precio > 0),
    tipo_precio     enum('POR_MAYOR', 'POR_MENOR') default 'POR_MENOR',
    cantidad_minima int                not null check (cantidad_minima > 0),
    fecha_creacion  timestamp default current_timestamp,

    unique (cliente_id, producto_id, tipo_precio),

    foreign key (cliente_id) references clientes (id) on update cascade on delete cascade,
    foreign key (producto_id) references productos (id) on update cascade on delete cascade
);

create table precios_categoria
(
    id                bigint primary key not null auto_increment,
    categoria_cliente enum('DISTRIBUIDOR','CONSUMIDOR_FINAL','CORPORATIVO'),
    producto_id       bigint             not null,
    precio            decimal(10, 2)     not null,
    aplica_igv        boolean default false,

    foreign key (producto_id) references productos (id)
);

create table ventas
(
    id              bigint primary key not null auto_increment,
    cliente_id      bigint             not null,
    total_pagar     decimal(10, 2)     not null check (total_pagar > 0),
    tipo_pago       enum('CREDITO', 'CANCELADO', 'ABONO') default 'CREDITO',
    cantidad_pagada decimal(10, 2) default 0,
    metodo_pago     enum('EFECTIVO', 'TRANSFERENCIA', 'YAPE_PLIN') default 'EFECTIVO',
    fecha_creacion  timestamp      default current_timestamp,
    estado          enum('ATENDIDO', 'EN_ESPERA', 'CANCELADO', 'REPROGRAMADO') default 'EN_ESPERA',

    foreign key (cliente_id) references clientes (id)
);

create table detalles_ventas
(
    id              bigint primary key not null auto_increment,
    venta_id        bigint             not null,
    producto_id     bigint             not null,
    cantidad        int                not null check (cantidad > 0),
    precio_unitario decimal(10, 2)     not null check (precio_unitario > 0),
    subtotal        decimal(10, 2)     not null check (subtotal > 0),

    foreign key (venta_id) references ventas (id) on update cascade on delete cascade,
    foreign key (producto_id) references productos (id)
);

create table cajas
(
    id             bigint primary key not null auto_increment,
    nombre         varchar(100)       not null unique,
    descripcion    varchar(200),
    saldo_actual   decimal(14, 2)     not null default 0.00,
    activa         boolean            not null default true,
    principal      boolean            not null default false,
    fecha_creacion timestamp                   default current_timestamp,

    index          idx_caja_activa (activa),
    index          idx_caja_principal (principal)
);

create table cuentas_por_cobrar
(
    id                bigint primary key not null auto_increment,
    venta_id          bigint             not null unique,
    cliente_id        bigint             not null,
    monto_total       decimal(14, 2)     not null check (monto_total > 0),
    monto_pagado      decimal(14, 2)     not null default 0.00 check (monto_pagado >= 0),
    saldo_pendiente   decimal(14, 2)     not null check (saldo_pendiente >= 0),
    estado            enum('PENDIENTE', 'PARCIAL', 'PAGADA') not null default 'PENDIENTE',
    fecha_vencimiento date,
    fecha_creacion    timestamp                   default current_timestamp,

    index             idx_cxc_cliente (cliente_id),
    index             idx_cxc_estado (estado),
    index             idx_cxc_venta (venta_id),

    foreign key (venta_id) references ventas (id) on update cascade on delete cascade,
    foreign key (cliente_id) references clientes (id) on update cascade
);

create table movimientos_caja
(
    id               bigint primary key not null auto_increment,
    caja_id          bigint             not null,
    tipo             enum('INGRESO', 'EGRESO') not null,
    categoria_egreso enum('COMPRA_INSUMOS', 'TRANSPORTE', 'SERVICIOS', 'MANTENIMIENTO', 'PLANILLA', 'OTROS'),
    origen           enum('VENTA', 'ABONO_CUENTA_COBRAR', 'EGRESO_MANUAL', 'INGRESO_MANUAL', 'APERTURA_CAJA', 'CIERRE_CAJA', 'AJUSTE') not null,
    monto            decimal(14, 2)     not null check (monto > 0),
    metodo_pago      enum('EFECTIVO', 'TRANSFERENCIA', 'YAPE_PLIN'),
    referencia       varchar(200),
    observacion      varchar(300),
    cliente_id       bigint,
    venta_id         bigint,
    fecha            timestamp default current_timestamp,

    index            idx_mov_caja (caja_id),
    index            idx_mov_fecha (fecha),
    index            idx_mov_tipo (tipo),
    index            idx_mov_origen (origen),
    index            idx_mov_venta (venta_id),

    foreign key (caja_id) references cajas (id) on update cascade,
    foreign key (cliente_id) references clientes (id) on update cascade,
    foreign key (venta_id) references ventas (id) on update cascade
);