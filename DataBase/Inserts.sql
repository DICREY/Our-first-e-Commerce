-- Active: 1747352860830@@127.0.0.1@3306@e_commerce
-- Roles
INSERT INTO e_commerce.roles (nom_rol) VALUES
('Administrador'),
('Usuario');

-- Personas
INSERT INTO e_commerce.personas (nom_per, ape_per, fec_nac_per, tip_doc_per, doc_per, dir_per, cel_per, cel2_per, email_per, pas_per,gen_per,fot_per) VALUES
('Juan', 'Pérez',NOW(), 'CC', '123450989', 'Calle 123 #45-67', '3001234567', NULL, 'juanperez@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Masculino',DEFAULT),
('María', 'Gómez',NOW(), 'CC', '876254321', 'Av. Principal #12-34', '3102345678', '3203456789', 'mariagomez@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Femenino',DEFAULT),
('Nikola', 'Tesla',CURRENT_DATE(), 'CC', '1298765432', 'Trasversal 12 #34-56', '3186789012', '', 'admin@gmail.com', '$2b$15$P3DlhprB7vdchCiVoGq7SOrvG/ZOJyVVyTInPk7QZPbaKbUNPPQa6','Masculino',''),
('Carlos', 'Rodríguez',NOW(), 'CE', '091234456', 'Carrera 56 #78-90', '3154567890', NULL, 'carlosrod@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Masculino',DEFAULT),
('Ana', 'Martínez',NOW(), 'CC', '112230944', 'Diagonal 34 #56-78', '3175678901', NULL, 'anamartinez@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Femenino', DEFAULT),
('Luis', 'García',NOW(), 'TI', '987654092', 'Transversal 12 #34-56', '3186789012', '3197890123', 'luisgarcia@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Masculino', DEFAULT);

-- Otorgar roles
INSERT INTO e_commerce.otorgar_roles (id_rol, id_per) VALUES
(1,1),(2,1),(1,2),(2,2),(1,3),(2,3),(2,4),(1,5),(2,5),(1,6),(2,6);

-- Categorías
INSERT INTO e_commerce.cat_productos (nom_cat_pro,slug) VALUES 
('Ropa de Mujer','ropa-de-mujer'), 
('Lencería','lenceria'),
('Ropa Deportiva Mujer','ropa-deportiva-mujer');  

-- Colores
INSERT INTO e_commerce.colores (nom_col, hex_col) VALUES 
('Rojo', '#FF0000'), ('Negro', '#000000'), ('Blanco', '#FFFFFF'),
('Azul Marino', '#000080'), ('Rosa', '#FFC0CB'), ('Beige', '#F5F5DC'),
('Verde Oliva', '#808000'), ('Morado', '#800080'), ('Gris', '#808080');

-- Imágenes
INSERT INTO e_commerce.imagenes (nom_img, url_img) VALUES
('img_1_2', 'https://i.pinimg.com/1200x/33/90/eb/3390eb933e22bf3a238bcf66eb2f3cfa.jpg'), -- id_img = 1
('img_1_3', 'https://i.pinimg.com/736x/06/e7/22/06e72242f6b362f6f7c4b9a0d27c2209.jpg'), -- id_img = 2
('img_1_5', 'url_1_5'), -- id_img = 3
('img_2_2', 'url_2_2'), -- id_img = 4
('img_2_4', 'url_2_4'), -- id_img = 5
('img_3_1', 'url_3_1'), -- id_img = 6
('img_3_4', 'url_3_4'), -- id_img = 7
('img_4_2', 'url_4_2'), -- id_img = 8
('img_4_3', 'url_4_3'), -- id_img = 9
('img_5_2', 'url_5_2'), -- id_img = 10
('img_5_4', 'url_5_4'), -- id_img = 11
('img_6_1', 'url_6_1'), -- id_img = 12
('img_6_2', 'url_6_2'), -- id_img = 13
('img_6_3', 'url_6_3'), -- id_img = 14
('img_6_9', 'url_6_9'), -- id_img = 15
('img_7_2', 'url_7_2'), -- id_img = 16
('img_7_4', 'url_7_4'), -- id_img = 17
('img_8_2', 'https://i.pinimg.com/1200x/ce/0e/7d/ce0e7d7e154e5542b11d76ddcb1b0984.jpg'), -- id_img = 18
('img_8_4', 'https://i.pinimg.com/736x/cb/0e/b8/cb0eb8cce725af5efc252ecb188bf842.jpg'), -- id_img = 19
('img_9_2', 'url_9_2'), -- id_img = 20
('img_9_4', 'url_9_4'), -- id_img = 21
('img_10_2', 'url_10_2'), -- id_img = 22
('img_10_4', 'url_10_4'), -- id_img = 23
('img_11_2', 'url_11_2'), -- id_img = 24
('img_11_4', 'url_11_4'), -- id_img = 25
('img_12_2', 'url_12_2'), -- id_img = 26
('img_12_4', 'url_12_4'), -- id_img = 27
('img_13_2', 'url_13_2'), -- id_img = 28
('img_13_4', 'url_13_4'), -- id_img = 29
('img_14_2', 'url_14_2'), -- id_img = 30
('img_14_4', 'url_14_4'), -- id_img = 31
('img_15_2', 'url_15_2'), -- id_img = 32
('img_15_4', 'url_15_4'), -- id_img = 33
('img_16_2', 'url_16_2'), -- id_img = 34
('img_16_4', 'url_16_4'), -- id_img = 35
('img_17_2', 'url_17_2'), -- id_img = 36
('img_17_4', 'url_17_4'), -- id_img = 37
('img_18_2', 'url_18_2'), -- id_img = 38
('img_18_4', 'url_18_4'), -- id_img = 39
('img_19_2', 'url_19_2'), -- id_img = 40
('img_19_4', 'url_19_4'); -- id_img = 41

-- Tallas
INSERT INTO e_commerce.tallas (nom_tal_pro) VALUES 
('XS'), ('S'), ('M'), ('L'), ('XL'), ('XXL'),
('34'), ('36'), ('38'), ('40'), ('42'), ('44'),
('Única');

-- Marcas
INSERT INTO e_commerce.marcas_productos ( nom_mar ) VALUES
('N/A');

-- Productos
INSERT INTO e_commerce.productos (cat_pro, nom_pro, mar_pro, pre_pro, pre_ori_pro, des_pro, sta_pro) VALUES
-- Ropa casual
(1, 'Blusa de seda estampada', 1, 45000.99, 40000.99, 'Blusa elegante de seda con estampado floral', DEFAULT),
(1, 'Jeans skinny alto talle', 1, 59000.99, 54000.99, 'Jeans ajustados con tiro alto y elastano', DEFAULT),
(1, 'Vestido midi floral', 1, 65000.99, 60000.99, 'Vestido hasta la rodilla con estampado de flores', DEFAULT),
-- Abrigos y chaquetas
(1, 'Chaqueta de denim', 1, 89000.99, 84000.99, 'Chaqueta estilo oversize en mezclilla', DEFAULT),
(1, 'Abrigo de lana invierno', 1, 129000.99, 120000.99, 'Abrigo largo para clima frío con cinturón', DEFAULT),
-- Ropa deportiva
(3, 'Leggings deportivos compresión', 1, 49000.99, 44000.99, 'Leggings de alta compresión para entrenamiento', DEFAULT),
(3, 'Top deportivo soporte alto', 1, 39000.99, 34000.99, 'Top con soporte máximo para actividades intensas', DEFAULT),
-- Lencería
(2, 'Conjunto de encaje negro', 1, 55000.99, 50000.99, 'Sujetador y braga de encaje con detalles delicados', DEFAULT),
(2, 'Pijama de satén corto', 1, 42000.99, 40000.99, 'Conjunto de pijama en satén suave', DEFAULT),
-- Ropa de baño
(1, 'Bikini estampado tropical', 1, 49000.99, 44000.99, 'Conjunto de bikini con estampado floral', DEFAULT),
(1, 'Bañador entero deportivo', 1, 59000.99, 54000.99, 'Bañador de una pieza para natación', DEFAULT),
-- Ropa formal
(1, 'Traje de chaqueta slim', 1, 149000.99, 144000.99, 'Conjunto de chaqueta y pantalón para oficina', DEFAULT),
(1, 'Vestido de cóctel elegante', 1, 119000.99, 114000.99, 'Vestido corto para eventos especiales', DEFAULT),
-- Ropa de maternidad
(1, 'Vestido maternidad verano', 1, 54000.99, 50000.99, 'Vestido holgado con tirantes ajustables', DEFAULT),
(1, 'Jeans maternidad elásticos', 1, 69000.99, 60000.99, 'Jeans con bandaja elástica para embarazo', DEFAULT),
-- Accesorios de moda
(1, 'Chal de cachemira', 1, 79000.99, 74000.99, 'Chal fino para todas las estaciones', DEFAULT),
(1, 'Fular de seda estampado', 1, 39000.99, 34000.99, 'Fular ligero con estampado artístico', DEFAULT),
-- Ropa plus size
(1, 'Vestido plus size floral', 1, 69000.99, 64000.99, 'Vestido holgado con estampado grande', DEFAULT),
(1, 'Blusa plus size manga larga', 1, 49000.99, 44000.99, 'Blusa elegante con detalles en cuello', DEFAULT),

(1, 'Vestido plus size', 1, 89000.99, 84000.99, 'Vestido holgado', 'NO-DISPONIBLE');

-- Relación producto-color-imagen
INSERT INTO e_commerce.productos_colores (img_pro_col, pro_col_pro, col_pro_col) VALUES 
(1, 1, 3), (2, 1, 2), (3, 1, 5),
(4, 2, 2), (5, 2, 4),
(6, 3, 1), (7, 3, 4),
(8, 4, 2), (9, 4, 3),
(10, 5, 2), (11, 5, 4),
(12, 6, 1), (13, 6, 2), (14, 6, 3), (15, 6, 9),
(16, 7, 2), (17, 7, 4),
(18, 8, 2), (19, 8, 4),
(20, 9, 2), (21, 9, 4),
(22, 10, 2), (23, 10, 4),
(24, 11, 2), (25, 11, 4),
(26, 12, 2), (27, 12, 4),
(28, 13, 2), (29, 13, 4),
(30, 14, 2), (31, 14, 4),
(32, 15, 2), (33, 15, 4),
(34, 16, 2), (35, 16, 4),
(36, 17, 2), (37, 17, 4),
(38, 18, 2), (39, 18, 4),
(40, 19, 2), (41, 19, 4);

-- Inventario: producto, color, talla, cantidad
INSERT INTO e_commerce.inventario (id_pro_inv, id_col_inv, id_tal_inv, cantidad) VALUES
-- Blusa de seda estampada (id_pro=1), Negro (id_col=2), Tallas XS(1)-L(4)
(1, 2, 1, 10), (1, 2, 2, 18), (1, 2, 3, 50), (1, 2, 4, 12),
-- Blusa de seda estampada, Blanco (3), Tallas XS(1)-L(4)
(1, 3, 1, 17), (1, 3, 2, 16), (1, 3, 3, 114), (1, 3, 4, 111),
-- Blusa de seda estampada, Rosa (5), Tallas XS(1)-L(4)
(1, 5, 1, 13), (1, 5, 2, 12), (1, 5, 3, 11), (1, 5, 4, 110),
-- Jeans skinny alto talle (id_pro=2), Negro (2), Tallas 34(7)-42(11)
(2, 2, 7, 15), (2, 2, 8, 14), (2, 2, 9, 13), (2, 2, 10, 12), (2, 2, 11, 11),
-- Jeans skinny alto talle, Azul Marino (4), Tallas 34(7)-42(11)
(2, 4, 7, 16), (2, 4, 8, 15), (2, 4, 9, 14), (2, 4, 10, 13), (2, 4, 11, 21),
-- Leggings deportivos compresión (id_pro=6), Rojo (1), Tallas XS(1)-XL(5)
(6, 1, 1, 10), (6, 1, 2, 10), (6, 1, 3, 10), (6, 1, 4, 10), (6, 1, 5, 10),
-- Top deportivo soporte alto (id_pro=7), Negro (2), Tallas XS(1)-XL(5)
(7, 2, 1, 18), (7, 2, 2, 18), (7, 2, 3, 18), (7, 2, 4, 81), (7, 2, 5, 18),
-- Vestido midi floral (id_pro=3), Negro (2), Talla M (3)
(3, 2, 3, 5),
-- Vestido midi floral, Azul Marino (4), Talla L (4)
(3, 4, 4, 3),
-- Chaqueta de denim (id_pro=4), Azul Marino (4), Talla M (3)
(4, 4, 3, 2),
-- Abrigo de lana invierno (id_pro=5), Negro (2), Talla L (4)
(5, 2, 4, 1),
-- Conjunto de encaje negro (id_pro=8), Negro (2), Talla S (2)
(8, 2, 2, 0),
-- Pijama de satén corto (id_pro=9), Rosa (5), Talla M (3)
(9, 5, 3, 0),
-- Bikini estampado tropical (id_pro=10), Rosa (5), Talla S (2)
(10, 5, 2, 0),
-- Bañador entero deportivo (id_pro=11), Negro (2), Talla M (3)
(11, 2, 3, 0),
-- Traje de chaqueta slim (id_pro=12), Negro (2), Talla L (4)
(12, 2, 4, 0),
-- Vestido de cóctel elegante (id_pro=13), Rosa (5), Talla M (3)
(13, 5, 3, 0),
-- Vestido maternidad verano (id_pro=14), Beige (6), Talla Única (12)
(14, 6, 12, 0),
-- Jeans maternidad elásticos (id_pro=15), Azul Marino (4), Talla 38 (9)
(15, 4, 9, 0),
-- Chal de cachemira (id_pro=16), Beige (6), Talla Única (12)
(16, 6, 12, 0),
-- Fular de seda estampado (id_pro=17), Rosa (5), Talla Única (12)
(17, 5, 12, 0),
-- Vestido plus size floral (id_pro=18), Morado (8), Talla XL (5)
(18, 8, 5, 0),
-- Blusa plus size manga larga (id_pro=19), Blanco (3), Talla XL (5)
(19, 3, 5, 0),
-- Vestido plus size (id_pro=20), Negro (2), Talla XXL (6)
(20, 2, 6, 0);

-- Métodos de pago
INSERT INTO e_commerce.metodos_pagos (nom_met_pag) VALUES 
('Tarjeta de Crédito'),
('Tarjeta de Débito'),
('PSE (Pagos Seguros en Línea)'),
('Contraentrega (Efectivo)'),
('Transferencia Bancaria'),
('Billetera Digital');

-- Métodos de envio
INSERT INTO e_commerce.metodos_envios (nom_met_env, pre_met_env, des_met_env) VALUES 
('Servientrega', 5000, 'Envio rapido por medio de transporte terrestre');

-- Pedidos
INSERT INTO e_commerce.pedidos (cli_ped, dir_env_ped, met_pag_ped, met_env_ped, sta_ped,fec_ped) VALUES
(1, 'Calle 123 #45-67, Bogotá', 1, 1, DEFAULT, '2025-09-20'),
(2, 'Av. Principal #12-34, Medellín', 3, 1, DEFAULT, '2025-08-20'),
(3, 'Carrera 56 #78-90, Cali', 4, 1, 'ENTREGADO', '2025-01-20'),
(4, 'Diagonal 34 #56-78, Barranquilla', 2, 1, 'PROCESANDO', '2025-07-20'),
(5, 'Transversal 12 #34-56, Cartagena', 5, 1, DEFAULT, '2025-09-20'),
(2, 'Calle 2 #2-2', 2, 1, 'ENTREGADO', '2025-07-02'),
(1, 'Calle 1 #1-1', 1, 1, 'ENTREGADO', '2025-07-01');

-- Detalle de pedidos
INSERT INTO e_commerce.productos_pedidos (id_ped, pro_ped, col_pro_ped, img_pro_ped, tal_pro_ped, can_pro_ped) VALUES
(1, 1, 2, 1, 1, 2),
(1, 6, 1, 12, 1, 1),
(2, 3, 1, 6, 3, 1),
(2, 9, 2, 20, 2, 2),
(2, 14, 2, 30, 4, 1),
(3, 5, 2, 10, 2, 1),
(3, 18, 2, 38, 1, 1),
(4, 8, 2, 18, 2, 2),
(4, 6, 1, 12, 3, 1),
(5, 2, 2, 4, 7, 3),
(5, 5, 2, 10, 2, 1),
(5, 13, 2, 28, 1, 2),
(5, 1, 2, 1, 1, 1),
(5, 7, 2, 16, 2, 1),
(6, 6, 1, 12, 2, 2),
(6, 2, 2, 4, 8, 1),
(7, 3, 1, 6, 1, 1),
(7, 4, 2, 8, 2, 2),
(7, 9, 2, 20, 2, 1),
(7, 14, 2, 30, 4, 1);

-- Oferta del 30% en toda la categoría de lencería
INSERT INTO e_commerce.ofertas (nom_ofe, des_ofe, dur_ofe, fec_ini_ofe, fec_fin_ofe, por_des_ofe) 
VALUES 
('Verano Sensual', '30% de descuento en toda nuestra colección de lencería para el verano',
0, '2025-08-01 00:00:00', '2025-08-31 23:59:59', 30),
('Flash Sale: Conjuntos de Encaje', '40% de descuento en conjuntos de encaje seleccionados por 48 horas', 
48,'2025-08-15 09:00:00', '2025-08-17 09:00:00', 40
);

-- Asociar la oferta a la categoría de lencería
INSERT INTO e_commerce.oferta_categoria_productos (ofe_pro, cat_ofe_pro) 
VALUES 
(1, 2);

INSERT INTO e_commerce.oferta_productos (ofe_pro, pro_ofe_pro) 
VALUES (2, 8);

INSERT INTO e_commerce.preferencias ( per_pre, theme ) VALUES
(1, 'DARK'),
(2, 'LIGHT'),
(3, 'DARK'),
(4, 'LIGHT'),
(5, 'LIGHT'),
(6, 'DARK');

/* Test */
-- Insertar el pedido con fecha del año pasado (2023)
INSERT INTO e_commerce.pedidos (cli_ped, dir_env_ped, met_pag_ped, met_env_ped, sta_ped, fec_ped) 
VALUES (
  3, -- ID del cliente (Nikola Tesla en tus datos)
  'Carrera 56 #78-90, Cali', -- Dirección de envío
  4, -- Método de pago: Contraentrega (Efectivo)
  1, -- Método de envio: Didi
  'ENTREGADO', -- Estado del pedido
  '2024-08-15' -- Fecha del pedido (15 de noviembre de 2025)
);

-- Obtener el ID del pedido recién insertado (supongamos que es el ID 8)
SET @last_pedido_id = LAST_INSERT_ID();

-- Insertar relación productos-pedido (usando IDs de productos existentes)
INSERT INTO e_commerce.productos_pedidos (id_ped, pro_ped, col_pro_ped, img_pro_ped, tal_pro_ped, can_pro_ped) 
VALUES 
  (@last_pedido_id, 5, 2, 10, 2, 2), -- Abrigo de lana invierno, color negro, imagen 10, talla M
  (@last_pedido_id, 16, 2, 34, 13, 2); -- Fular de seda estampado, color negro, imagen 34, talla única