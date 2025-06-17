-- Active: 1747352860830@@127.0.0.1@3306@e_commerce
INSERT INTO e_commerce.roles (nom_rol,fot_rol) VALUES
('Administrador','https://imgs.search.brave.com/JheS1cTjYH1Y1E7rp1FADfQDL9uXw20FxZAFfjZwEaY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9k/L2Q0L04uVGVzbGEu/SlBH'),
('Veterinario','https://imgs.search.brave.com/rL6dnhwCDXLvz02lsRs2QjVj1F8o-8D0o4pTYhmHah8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi9jL2M4L01h/cmllX0N1cmllX2Mu/XzE5MjBzLmpwZy81/MTJweC1NYXJpZV9D/dXJpZV9jLl8xOTIw/cy5qcGc'),
('Usuario','https://imgs.search.brave.com/kWZPq0vRV5Hl9y9RS9CtH5o-SRhsHFZfA8twL1VUavI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9oaXBz/LmhlYXJzdGFwcHMu/Y29tL2htZy1wcm9k/L2ltYWdlcy9nZXR0/eWltYWdlcy02MTUz/MTI2MzQuanBnP2Ny/b3A9MXh3OjEuMHho/O2NlbnRlcix0b3Am/cmVzaXplPTY0MDoq');
INSERT INTO e_commerce.personas (nom_per, ape_per, fec_nac_per, tip_doc_per, doc_per, dir_per, cel_per, cel2_per, email_per, cont_per,gen_per) VALUES
('Juan', 'Pérez',NOW(), 'CC', '123450989', 'Calle 123 #45-67', '3001234567', NULL, 'juanperez@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Masculino'),
('María', 'Gómez',NOW(), 'CC', '876254321', 'Av. Principal #12-34', '3102345678', '3203456789', 'mariagomez@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Femenino'),
('Carlos', 'Rodríguez',NOW(), 'CE', '091234456', 'Carrera 56 #78-90', '3154567890', NULL, 'carlosrod@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Masculino'),
('Ana', 'Martínez',NOW(), 'CC', '112230944', 'Diagonal 34 #56-78', '3175678901', NULL, 'anamartinez@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Femenino'),
('Luis', 'García',NOW(), 'TI', '987654092', 'Transversal 12 #34-56', '3186789012', '3197890123', 'luisgarcia@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Masculino');
INSERT INTO e_commerce.otorgar_roles (id_rol, id_per) VALUES
(1,1),
(2,1),
(3,1),
(1,2),
(2,2),
(3,2),
(1,3),
(2,3),
(3,3),
(2,4),
(1,5),
(2,5),
(3,5);

-- 1. Insertar categorías
INSERT INTO e_commerce.cat_productos (nom_cat_pro) VALUES 
('Ropa de Mujer'), ('Lencería'), ('Ropa Deportiva Mujer');

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
(1, 'Blusa de seda estampada', 45.99, 'Blusa elegante de seda con estampado floral', 'blusa_seda.jpg'),
(1, 'Jeans skinny alto talle', 59.99, 'Jeans ajustados con tiro alto y elastano', 'jeans_skinny.jpg'),
(1, 'Vestido midi floral', 65.99, 'Vestido hasta la rodilla con estampado de flores', 'vestido_midi.jpg'),
-- Abrigos y chaquetas
(1, 'Chaqueta de denim', 89.99, 'Chaqueta estilo oversize en mezclilla', 'chaqueta_denim.jpg'),
(1, 'Abrigo de lana invierno', 129.99, 'Abrigo largo para clima frío con cinturón', 'abrigo_lana.jpg'),
-- Ropa deportiva
(3, 'Leggings deportivos compresión', 49.99, 'Leggings de alta compresión para entrenamiento', 'leggings_deporte.jpg'),
(3, 'Top deportivo soporte alto', 39.99, 'Top con soporte máximo para actividades intensas', 'top_deporte.jpg'),
-- Lencería
(2, 'Conjunto de encaje negro', 55.99, 'Sujetador y braga de encaje con detalles delicados', 'lenceria_encaje.jpg'),
(2, 'Pijama de satén corto', 42.99, 'Conjunto de pijama en satén suave', 'pijama_saten.jpg'),
-- Ropa de baño
(1, 'Bikini estampado tropical', 49.99, 'Conjunto de bikini con estampado floral', 'bikini_tropical.jpg'),
(1, 'Bañador entero deportivo', 59.99, 'Bañador de una pieza para natación', 'banador_deporte.jpg'),
-- Ropa formal
(1, 'Traje de chaqueta slim', 149.99, 'Conjunto de chaqueta y pantalón para oficina', 'traje_chaqueta.jpg'),
(1, 'Vestido de cóctel elegante', 119.99, 'Vestido corto para eventos especiales', 'vestido_coctel.jpg'),
-- Ropa de maternidad
(1, 'Vestido maternidad verano', 54.99, 'Vestido holgado con tirantes ajustables', 'vestido_maternidad.jpg'),
(1, 'Jeans maternidad elásticos', 69.99, 'Jeans con bandaja elástica para embarazo', 'jeans_maternidad.jpg'),
-- Accesorios de moda
(1, 'Chal de cachemira', 79.99, 'Chal fino para todas las estaciones', 'chal_cachemira.jpg'),
(1, 'Fular de seda estampado', 39.99, 'Fular ligero con estampado artístico', 'fular_seda.jpg'),
-- Ropa plus size
(1, 'Vestido plus size floral', 69.99, 'Vestido holgado con estampado grande', 'vestido_plus.jpg'),
(1, 'Blusa plus size manga larga', 49.99, 'Blusa elegante con detalles en cuello', 'blusa_plus.jpg');

-- Asignación de colores y tallas a algunos productos
-- Blusa de seda estampada (id_pro 1)
INSERT INTO e_commerce.productos_colores (pro_col_pro, col_pro_col) VALUES 
(1, 2), (1, 3), (1, 5);  -- Negro, Blanco, Rosa

INSERT INTO e_commerce.productos_tallas (pro_tal_pro, tal_pro_tal) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4);  -- XS, S, M, L

-- Jeans skinny (id_pro 2)
INSERT INTO e_commerce.productos_colores (pro_col_pro, col_pro_col) VALUES 
(2, 2), (2, 4);  -- Negro, Azul Marino

INSERT INTO e_commerce.productos_tallas (pro_tal_pro, tal_pro_tal) VALUES 
(2, 7), (2, 8), (2, 9), (2, 10), (2, 11);  -- 34, 36, 38, 40, 42

-- Leggings deportivos (id_pro 6)
INSERT INTO e_commerce.productos_colores (pro_col_pro, col_pro_col) VALUES 
(6, 1), (6, 2), (6, 3), (6, 9);  -- Rojo, Negro, Blanco, Gris

INSERT INTO e_commerce.productos_tallas (pro_tal_pro, tal_pro_tal) VALUES 
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6);  -- XS, S, M, L, XL, XXL