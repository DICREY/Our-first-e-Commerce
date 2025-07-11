-- Active: 1750268475844@@127.0.0.1@3306@e_commerce
INSERT INTO e_commerce.roles (nom_rol) VALUES
('Administrador'),
('Usuario');
INSERT INTO e_commerce.personas (nom_per, ape_per, fec_nac_per, tip_doc_per, doc_per, dir_per, cel_per, cel2_per, email_per, pas_per,gen_per,fot_per) VALUES
('Juan', 'Pérez',NOW(), 'CC', '123450989', 'Calle 123 #45-67', '3001234567', NULL, 'juanperez@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Masculino',DEFAULT),
('María', 'Gómez',NOW(), 'CC', '876254321', 'Av. Principal #12-34', '3102345678', '3203456789', 'mariagomez@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Femenino',DEFAULT),
('Nikola', 'Tesla',CURRENT_DATE(), 'CC', '1298765432', 'Trasversal 12 #34-56', '3186789012', '', 'admin@gmail.com', '$2b$15$P3DlhprB7vdchCiVoGq7SOrvG/ZOJyVVyTInPk7QZPbaKbUNPPQa6','Masculino',''),
('Carlos', 'Rodríguez',NOW(), 'CE', '091234456', 'Carrera 56 #78-90', '3154567890', NULL, 'carlosrod@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Masculino',DEFAULT),
('Ana', 'Martínez',NOW(), 'CC', '112230944', 'Diagonal 34 #56-78', '3175678901', NULL, 'anamartinez@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Femenino', DEFAULT),
('Luis', 'García',NOW(), 'TI', '987654092', 'Transversal 12 #34-56', '3186789012', '3197890123', 'luisgarcia@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Masculino', DEFAULT);
INSERT INTO e_commerce.otorgar_roles (id_rol, id_per) VALUES
(1,1),
(2,1),
(1,2),
(2,2),
(1,3),
(2,3),
(2,4),
(1,5),
(2,5),
(1,6),
(2,6);

-- 1. Insertar categorías
INSERT INTO e_commerce.cat_productos (nom_cat_pro,slug) VALUES 
('Ropa de Mujer','ropa-de-mujer'), 
('Lencería','lenceria'),
('Ropa Deportiva Mujer','ropa-deportiva-mujer');  

-- 2. Insertar colores
INSERT INTO e_commerce.colores (nom_col, hex_col) VALUES 
('Rojo', '#FF0000'), ('Negro', '#000000'), ('Blanco', '#FFFFFF'),
('Azul Marino', '#000080'), ('Rosa', '#FFC0CB'), ('Beige', '#F5F5DC'),
('Verde Oliva', '#808000'), ('Morado', '#800080'), ('Gris', '#808080');

INSERT INTO e_commerce.imagenes (nom_img, url_img) VALUES
('img_1_2', 'url_1_2'), -- id_img = 1
('img_1_3', 'url_1_3'), -- id_img = 2
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
('img_8_2', 'url_8_2'), -- id_img = 18
('img_8_4', 'url_8_4'), -- id_img = 19
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

-- 3. Insertar tallas específicas para mujer
INSERT INTO e_commerce.tallas (nom_tal_pro) VALUES 
('XS'), ('S'), ('M'), ('L'), ('XL'), ('XXL'),
('34'), ('36'), ('38'), ('40'), ('42'), ('44'),
('Única');

-- 4. Insertar 20 productos de ropa para mujer
INSERT INTO e_commerce.productos (cat_pro, nom_pro, pre_pro, des_pro) VALUES
-- Ropa casual
(1, 'Blusa de seda estampada', 45.99, 'Blusa elegante de seda con estampado floral'),
(1, 'Jeans skinny alto talle', 59.99, 'Jeans ajustados con tiro alto y elastano'),
(1, 'Vestido midi floral', 65.99, 'Vestido hasta la rodilla con estampado de flores'),
-- Abrigos y chaquetas
(1, 'Chaqueta de denim', 89.99, 'Chaqueta estilo oversize en mezclilla'),
(1, 'Abrigo de lana invierno', 129.99, 'Abrigo largo para clima frío con cinturón'),
-- Ropa deportiva
(3, 'Leggings deportivos compresión', 49.99, 'Leggings de alta compresión para entrenamiento'),
(3, 'Top deportivo soporte alto', 39.99, 'Top con soporte máximo para actividades intensas'),
-- Lencería
(2, 'Conjunto de encaje negro', 55.99, 'Sujetador y braga de encaje con detalles delicados'),
(2, 'Pijama de satén corto', 42.99, 'Conjunto de pijama en satén suave'),
-- Ropa de baño
(1, 'Bikini estampado tropical', 49.99, 'Conjunto de bikini con estampado floral'),
(1, 'Bañador entero deportivo', 59.99, 'Bañador de una pieza para natación'),
-- Ropa formal
(1, 'Traje de chaqueta slim', 149.99, 'Conjunto de chaqueta y pantalón para oficina'),
(1, 'Vestido de cóctel elegante', 119.99, 'Vestido corto para eventos especiales'),
-- Ropa de maternidad
(1, 'Vestido maternidad verano', 54.99, 'Vestido holgado con tirantes ajustables'),
(1, 'Jeans maternidad elásticos', 69.99, 'Jeans con bandaja elástica para embarazo'),
-- Accesorios de moda
(1, 'Chal de cachemira', 79.99, 'Chal fino para todas las estaciones'),
(1, 'Fular de seda estampado', 39.99, 'Fular ligero con estampado artístico'),
-- Ropa plus size
(1, 'Vestido plus size floral', 69.99, 'Vestido holgado con estampado grande'),
(1, 'Blusa plus size manga larga', 49.99, 'Blusa elegante con detalles en cuello');

-- Asignación de colores y tallas a algunos productos
INSERT INTO e_commerce.productos_colores (img_pro_col, pro_col_pro, col_pro_col) VALUES 
(1, 1, 2), (2, 1, 3), (3, 1, 5),
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

INSERT INTO e_commerce.productos_tallas (pro_tal_pro, tal_pro_tal) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4),  -- XS, S, M, L
(2, 7), (2, 8), (2, 9), (2, 10), (2, 11),  -- 34, 36, 38, 40, 42
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6);  -- XS, S, M, L, XL, XXL

INSERT INTO e_commerce.metodos_pagos (nom_met_pag) VALUES 
('Tarjeta de Crédito'),
('Tarjeta de Débito'),
('PSE (Pagos Seguros en Línea)'),
('Contraentrega (Efectivo)'),
('Transferencia Bancaria'),
('Billetera Digital');

INSERT INTO e_commerce.pedidos (cli_ped, dir_env_ped, met_pag_ped, sta_ped) VALUES
(1, 'Calle 123 #45-67, Bogotá', 1, DEFAULT),  -- Pedido 1: Cliente Juan Pérez (ID 1)
(2, 'Av. Principal #12-34, Medellín', 3, DEFAULT), -- Pedido 2: Cliente María Gómez (ID 2)
(3, 'Carrera 56 #78-90, Cali', 4, 'ENTREGADO'),  -- Pedido 3: Cliente Carlos Rodríguez (ID 3) - Este cliente es hombre pero podría comprar para regalo
(4, 'Diagonal 34 #56-78, Barranquilla', 2, 'PROCESANDO'), -- Pedido 4: Cliente Ana Martínez (ID 4)
(5, 'Transversal 12 #34-56, Cartagena', 5, DEFAULT); -- Pedido 5: Cliente Luis García (ID 5) - Compra grande

INSERT INTO e_commerce.detalle_pedidos (ped_det_ped, pro_det_ped, can_det_ped, pre_uni_det_ped) VALUES
(1, 1, 2, 45.99),  -- 2 Blusas de seda
(1, 6, 1, 49.99),   -- 1 Legging deportivo
(2, 3, 1, 65.99),  -- 1 Vestido midi floral
(2, 8, 2, 55.99),  -- 2 Conjuntos de encaje
(2, 12, 1, 119.99), -- 1 Vestido de cóctel
(3, 5, 1, 129.99),  -- 1 Abrigo de lana
(3, 17, 1, 79.99),   -- 1 Chal de cachemira
(4, 7, 2, 39.99),   -- 2 Tops deportivos
(4, 10, 1, 49.99),   -- 1 Bikini tropical
(5, 2, 3, 59.99),   -- 3 Jeans skinny
(5, 4, 1, 89.99),    -- 1 Chaqueta de denim
(5, 9, 2, 42.99),    -- 2 Pijamas de satén
(5, 13, 1, 149.99),  -- 1 Traje de chaqueta
(5, 19, 1, 69.99);   -- 1 Vestido plus size