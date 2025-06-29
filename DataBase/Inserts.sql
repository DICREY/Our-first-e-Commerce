-- Active: 1746130779175@@127.0.0.1@3306@e_commerce
INSERT INTO e_commerce.roles (nom_rol) VALUES
('Administrador'),
('Usuario');
INSERT INTO e_commerce.personas (nom_per, ape_per, fec_nac_per, tip_doc_per, doc_per, dir_per, cel_per, cel2_per, email_per, pas_per,gen_per,fot_per) VALUES
('Juan', 'Pérez',NOW(), 'CC', '123450989', 'Calle 123 #45-67', '3001234567', NULL, 'juanperez@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Masculino',DEFAULT),
('María', 'Gómez',NOW(), 'CC', '876254321', 'Av. Principal #12-34', '3102345678', '3203456789', 'mariagomez@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Femenino',DEFAULT),
('Nikola', 'Tesla',CURRENT_DATE(), 'CC', '1298765432', 'Trasversal 12 #34-56', '3186789012', '', 'admin@gmail.com', '$2b$15$P3DlhprB7vdchCiVoGq7SOrvG/ZOJyVVyTInPk7QZPbaKbUNPPQa6','Masculino','https://imgs.search.brave.com/JheS1cTjYH1Y1E7rp1FADfQDL9uXw20FxZAFfjZwEaY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9k/L2Q0L04uVGVzbGEu/SlBH'),
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

-- 3. Insertar tallas específicas para mujer
INSERT INTO e_commerce.tallas (nom_tal_pro) VALUES 
('XS'), ('S'), ('M'), ('L'), ('XL'), ('XXL'),
('34'), ('36'), ('38'), ('40'), ('42'), ('44'),
('Única');

-- 4. Insertar 20 productos de ropa para mujer
INSERT INTO e_commerce.productos (cat_pro, nom_pro, pre_pro, des_pro, img_pro) VALUES
-- Ropa casual
(1, 'Blusa de seda estampada', 45.99, 'Blusa elegante de seda con estampado floral', DEFAULT),
(1, 'Jeans skinny alto talle', 59.99, 'Jeans ajustados con tiro alto y elastano', DEFAULT),
(1, 'Vestido midi floral', 65.99, 'Vestido hasta la rodilla con estampado de flores', DEFAULT),
-- Abrigos y chaquetas
(1, 'Chaqueta de denim', 89.99, 'Chaqueta estilo oversize en mezclilla', DEFAULT),
(1, 'Abrigo de lana invierno', 129.99, 'Abrigo largo para clima frío con cinturón', DEFAULT),
-- Ropa deportiva
(3, 'Leggings deportivos compresión', 49.99, 'Leggings de alta compresión para entrenamiento', DEFAULT),
(3, 'Top deportivo soporte alto', 39.99, 'Top con soporte máximo para actividades intensas', DEFAULT),
-- Lencería
(2, 'Conjunto de encaje negro', 55.99, 'Sujetador y braga de encaje con detalles delicados', DEFAULT),
(2, 'Pijama de satén corto', 42.99, 'Conjunto de pijama en satén suave', DEFAULT),
-- Ropa de baño
(1, 'Bikini estampado tropical', 49.99, 'Conjunto de bikini con estampado floral', DEFAULT),
(1, 'Bañador entero deportivo', 59.99, 'Bañador de una pieza para natación', DEFAULT),
-- Ropa formal
(1, 'Traje de chaqueta slim', 149.99, 'Conjunto de chaqueta y pantalón para oficina', DEFAULT),
(1, 'Vestido de cóctel elegante', 119.99, 'Vestido corto para eventos especiales', DEFAULT),
-- Ropa de maternidad
(1, 'Vestido maternidad verano', 54.99, 'Vestido holgado con tirantes ajustables', DEFAULT),
(1, 'Jeans maternidad elásticos', 69.99, 'Jeans con bandaja elástica para embarazo', DEFAULT),
-- Accesorios de moda
(1, 'Chal de cachemira', 79.99, 'Chal fino para todas las estaciones', DEFAULT),
(1, 'Fular de seda estampado', 39.99, 'Fular ligero con estampado artístico', DEFAULT),
-- Ropa plus size
(1, 'Vestido plus size floral', 69.99, 'Vestido holgado con estampado grande', DEFAULT),
(1, 'Blusa plus size manga larga', 49.99, 'Blusa elegante con detalles en cuello', DEFAULT);

-- Asignación de colores y tallas a algunos productos
INSERT INTO e_commerce.productos_colores (pro_col_pro, col_pro_col) VALUES 
(1, 2), (1, 3), (1, 5),  -- Negro, Blanco, Rosa
(2, 2), (2, 4),  -- Negro, Azul Marino
(3, 1), (3, 4),
(4, 2), (4, 3),
(5, 2), (5, 4),
(6, 1), (6, 2), (6, 3), (6, 9),  -- Rojo, Negro, Blanco, Gris
(7, 2), (7, 4),
(8, 2), (8, 4),
(9, 2), (9, 4),
(10, 2), (10, 4),
(11, 2), (11, 4),
(12, 2), (12, 4),
(13, 2), (13, 4),
(14, 2), (14, 4),
(15, 2), (15, 4),
(16, 2), (16, 4),
(17, 2), (17, 4),
(18, 2), (18, 4),
(19, 2), (19, 4);

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