DROP
DATABASE IF EXISTS bencol_db;
CREATE
DATABASE bencol_db;

USE
bencol_db;
-- ======================================================================================
create table roles
(
    id             bigint primary key not null auto_increment,
    nombre         enum('SUPER_ADMIN', 'ADMIN_EMPRESA', 'VENDEDOR', 'CAJA', 'SUPERVISOR') not null unique,
    descripcion    varchar(200),
    fecha_creacion timestamp default current_timestamp
);

create table empresas
(
    id               bigint primary key not null auto_increment,
    razon_social     varchar(250)       not null,
    nombre_comercial varchar(250)       not null,
    ruc              varchar(20) null unique,
    correo           varchar(250) null,
    telefono         varchar(20) null,
    direccion        varchar(250) null,
    estado           enum('ACTIVO', 'INACTIVO') not null default 'ACTIVO',
    fecha_creacion   timestamp default current_timestamp,
    index            idx_empresas_estado (estado)
);

create table usuarios
(
    id                  bigint primary key not null auto_increment,
    empresa_id          bigint null,
    rol_id              bigint             not null,
    nombre              varchar(150)       not null,
    correo              varchar(250)       not null unique,
    celular             varchar(20)        not null unique,
    password_hash       varchar(255) null,
    estado              enum('PENDIENTE_VERIFICACION', 'ACTIVO', 'INACTIVO', 'BLOQUEADO') not null default 'PENDIENTE_VERIFICACION',
    email_verificado    boolean            not null default false,
    ultimo_login        timestamp null,
    fecha_creacion      timestamp                   default current_timestamp,
    fecha_actualizacion timestamp                   default current_timestamp on update current_timestamp,
    index               idx_usuarios_correo (correo),
    index               idx_usuarios_celular (celular),
    index               idx_usuarios_estado (estado),
    index               idx_usuarios_empresa (empresa_id),
    foreign key (empresa_id) references empresas (id) on update cascade,
    foreign key (rol_id) references roles (id) on update cascade
);

create table usuario_tokens
(
    id               bigint primary key not null auto_increment,
    usuario_id       bigint             not null,
    token            varchar(120)       not null unique,
    tipo             enum('VERIFICACION_EMAIL', 'RECUPERACION_PASSWORD') not null,
    usado            boolean            not null default false,
    fecha_expiracion timestamp          not null,
    fecha_creacion   timestamp                   default current_timestamp,
    index            idx_usuario_tokens_token (token),
    index            idx_usuario_tokens_tipo (tipo),
    foreign key (usuario_id) references usuarios (id) on update cascade on delete cascade
);

create table sesiones_usuario
(
    id               bigint primary key not null auto_increment,
    usuario_id       bigint             not null,
    token_jti        varchar(120)       not null unique,
    ip               varchar(80) null,
    user_agent       varchar(300) null,
    activa           boolean            not null default true,
    fecha_inicio     timestamp                   default current_timestamp,
    fecha_expiracion timestamp          not null,
    fecha_cierre     timestamp null,
    ultima_actividad timestamp null,
    index            idx_sesiones_usuario (usuario_id),
    index            idx_sesiones_activa (activa),
    foreign key (usuario_id) references usuarios (id) on update cascade on delete cascade
);
-- ======================================================================================
create table clientes
(
    id        bigint primary key not null auto_increment,
    nombre    varchar(250)       not null,
    direccion varchar(250)       not null,
    correo    varchar(250) null unique,
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

-- inserts clientes
insert into clientes (nombre, direccion, correo, telefono, categoria, estado)
values ('Juan Perez', 'Av. America Norte 123 - Trujillo', 'juan.perez@gmail.com', '987654321', 'CONSUMIDOR_FINAL',
        'ACTIVO'),
       ('Distribuidora Norte SAC', 'Av. Industrial 456 - Trujillo', 'ventas@norte.com', '944112233', 'DISTRIBUIDOR',
        'ACTIVO'),
       ('Empresa Agua Clara', 'Jr. Pizarro 890 - Trujillo', 'contacto@aguaclara.com', '955667788', 'CORPORATIVO',
        'ACTIVO'),
       ('Maria Lopez', 'Mz B Lt 12 - El Porvenir', 'maria.lopez@gmail.com', '912345678', 'CONSUMIDOR_FINAL', 'ACTIVO'),
       ('Comercial Valle SRL', 'Av. Larco 1500 - Trujillo', 'info@valle.com', '977889900', 'DISTRIBUIDOR', 'INACTIVO');

-- inserts productos
insert into productos (tipo, precio, estado)
values ('BIDON_20_LITROS', 12.50, 'ACTIVO'),
       ('BOTELLA_650_MILILITROS', 2.00, 'ACTIVO'),
       ('BOTELLA_1_LITRO', 3.00, 'ACTIVO'),
       ('BOTELLA_2_5_LITROS', 5.50, 'ACTIVO'),
       ('BIDON_20_LITROS', 13.00, 'INACTIVO');



