-- inserts clientes
insert into clientes (nombre, direccion, correo, telefono, categoria, estado) values
('Juan Perez', 'Av. America Norte 123 - Trujillo', 'juan.perez@gmail.com', '987654321', 'CONSUMIDOR_FINAL', 'ACTIVO'),
('Distribuidora Norte SAC', 'Av. Industrial 456 - Trujillo', 'ventas@norte.com', '944112233', 'DISTRIBUIDOR', 'ACTIVO'),
('Empresa Agua Clara', 'Jr. Pizarro 890 - Trujillo', 'contacto@aguaclara.com', '955667788', 'CORPORATIVO', 'ACTIVO'),
('Maria Lopez', 'Mz B Lt 12 - El Porvenir', 'maria.lopez@gmail.com', '912345678', 'CONSUMIDOR_FINAL', 'ACTIVO'),
('Comercial Valle SRL', 'Av. Larco 1500 - Trujillo', 'info@valle.com', '977889900', 'DISTRIBUIDOR', 'INACTIVO');

-- inserts productos
insert into productos (tipo, precio, estado) values
('BIDON_20_LITROS', 12.50, 'ACTIVO'),
('BOTELLA_650_MILILITROS', 2.00, 'ACTIVO'),
('BOTELLA_1_LITRO', 3.00, 'ACTIVO'),
('BOTELLA_2_5_LITROS', 5.50, 'ACTIVO'),
('BIDON_20_LITROS', 13.00, 'INACTIVO');