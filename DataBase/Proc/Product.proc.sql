-- Active: 1747352860830@@127.0.0.1@3306@e_commerce
CREATE PROCEDURE e_commerce.GetProductsCategories()
BEGIN
    -- Verifica si hay categorias
    IF NOT EXISTS (SELECT 1 FROM cat_productos) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La categoria no existe en el sistema';
    END IF;

    SELECT
        c.nom_cat_pro,
        c.slug,
        c.sta_cat_pro
    FROM cat_productos c
    LIMIT 1000;
END //
CREATE PROCEDURE e_commerce.GetProductsColors()
BEGIN
    -- Verifica si hay colores
    IF NOT EXISTS (SELECT 1 FROM colores) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No existen colores en el sistema';
    END IF;

    SELECT
        c.nom_col,
        c.hex_col
    FROM colores c
    LIMIT 1000;
END //
CREATE PROCEDURE e_commerce.GetProductsSizes()
BEGIN
    -- Verifica si hay tallas
    IF NOT EXISTS (SELECT 1 FROM tallas) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No existen tallas en el sistema';
    END IF;

    SELECT
        t.nom_tal_pro
    FROM tallas t
    LIMIT 1000;
END //
CREATE PROCEDURE e_commerce.GetAllProducts()
BEGIN
    IF NOT EXISTS (SELECT 1 FROM e_commerce.productos) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No existen productos registrados';
    END IF;

    SELECT 
        p.id_pro,
        p.nom_pro,
        p.pre_pro,
        p.des_pro,
        p.sta_pro,
        p.onSale,
        p.created_at,
        p.updated_at,
        c.id_cat_pro,
        c.nom_cat_pro,
        (
            SELECT img.url_img
            FROM 
                productos_colores pco
            JOIN
                imagenes img ON pco.img_pro_col = img.id_img
            WHERE
                pco.pro_col_pro = p.id_pro
            LIMIT 1
        ) AS img_default,
        -- Colores disponibles para el producto
        (
            SELECT GROUP_CONCAT(
                CONCAT_WS(';',
                    co.nom_col,
                    co.hex_col,
                    img.nom_img,
                    img.url_img
                ) 
                SEPARATOR '---'
            )
            FROM 
                productos_colores pco
            JOIN
                colores co ON pco.col_pro_col = co.id_col
            JOIN
                imagenes img ON pco.img_pro_col = img.id_img
            WHERE
                pco.pro_col_pro = p.id_pro
        ) AS colors,
        -- Tallas disponibles para el producto (por inventario)
        (
            SELECT GROUP_CONCAT(DISTINCT t.nom_tal_pro SEPARATOR '---')
            FROM inventario inv
            JOIN tallas t ON inv.id_tal_inv = t.id_tal_pro
            WHERE inv.id_pro_inv = p.id_pro
        ) AS sizes,
        -- Stock total del producto (sumando todas las combinaciones)
        (
            SELECT SUM(inv.cantidad)
            FROM inventario inv
            WHERE inv.id_pro_inv = p.id_pro
        ) AS stock_total,
        -- cantidad vendidad este mes
        (
            SELECT SUM(pp.can_pro_ped)
            FROM productos_pedidos pp
            JOIN pedidos pd ON pp.id_ped = pd.id_ped
            WHERE pd.fec_ped >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)
            AND pp.pro_ped = p.id_pro
            AND pd.sta_ped = 'ENTREGADO'
        ) AS ventas_mes,
        (
            SELECT GROUP_CONCAT(
                CONCAT_WS(';',
                    o.id_ofe,
                    o.nom_ofe,
                    o.des_ofe,
                    o.dur_ofe,
                    o.fec_ini_ofe,
                    o.fec_fin_ofe,
                    o.por_des_ofe,
                    o.created_at,
                    o.updated_at
                ) 
                SEPARATOR '---'
            )
            FROM
                ofertas o 
            JOIN 
                oferta_categoria_productos ocp ON ocp.cat_ofe_pro = p.cat_pro
            JOIN 
                oferta_productos op ON op.pro_ofe_pro = p.id_pro
            WHERE
                o.fec_fin_ofe > CURRENT_TIMESTAMP
                AND (
                    ocp.ofe_pro = o.id_ofe 
                    OR op.ofe_pro = o.id_ofe
                )
        )AS offers
    FROM 
        e_commerce.productos p
    INNER JOIN 
        e_commerce.cat_productos c ON p.cat_pro = c.id_cat_pro
    ORDER BY p.id_pro DESC
    LIMIT 1000;
END //

CREATE PROCEDURE e_commerce.GetProductBy(
    IN p_by VARCHAR(100)
)
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM e_commerce.productos
        WHERE id_pro LIKE p_by OR nom_pro LIKE p_by
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No existen productos registrados';
    END IF;

    SELECT 
        p.*,
        c.id_cat_pro,
        c.nom_cat_pro,
        (
            SELECT img.url_img
            FROM 
                productos_colores pco
            JOIN
                imagenes img ON pco.img_pro_col = img.id_img
            WHERE
                pco.pro_col_pro = p.id_pro
            LIMIT 1
        ) AS img_default,
        -- Colores disponibles para el producto
        (
            SELECT GROUP_CONCAT(
                CONCAT_WS(';',
                    co.nom_col,
                    co.hex_col,
                    img.nom_img,
                    img.url_img
                ) 
                SEPARATOR '---'
            )
            FROM 
                productos_colores pco
            JOIN
                colores co ON pco.col_pro_col = co.id_col
            JOIN
                imagenes img ON pco.img_pro_col = img.id_img
            WHERE
                pco.pro_col_pro = p.id_pro
        ) AS colors,
        -- Tallas disponibles para el producto (por inventario)
        (
            SELECT GROUP_CONCAT(DISTINCT t.nom_tal_pro SEPARATOR '---')
            FROM inventario inv
            JOIN tallas t ON inv.id_tal_inv = t.id_tal_pro
            WHERE inv.id_pro_inv = p.id_pro
        ) AS sizes,
        -- Stock total del producto (sumando todas las combinaciones)
        (
            SELECT SUM(inv.cantidad)
            FROM inventario inv
            WHERE inv.id_pro_inv = p.id_pro
        ) AS stock_total,
        -- cantidad vendidad este mes
        (
            SELECT SUM(pp.can_pro_ped)
            FROM productos_pedidos pp
            JOIN pedidos pd ON pp.id_ped = pd.id_ped
            WHERE pd.fec_ped >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)
            AND pp.pro_ped = p.id_pro
            AND pd.sta_ped = 'ENTREGADO'
        ) AS ventas_mes,
        (
            SELECT GROUP_CONCAT(
                CONCAT_WS(';',
                    o.id_ofe,
                    o.nom_ofe,
                    o.des_ofe,
                    o.dur_ofe,
                    o.fec_ini_ofe,
                    o.fec_fin_ofe,
                    o.por_des_ofe,
                    o.created_at,
                    o.updated_at
                ) 
                SEPARATOR '---'
            )
            FROM
                ofertas o 
            JOIN 
                oferta_categoria_productos ocp ON ocp.cat_ofe_pro = p.cat_pro
            JOIN 
                oferta_productos op ON op.pro_ofe_pro = p.id_pro
            WHERE
                o.fec_fin_ofe > CURRENT_TIMESTAMP
                AND (
                    ocp.ofe_pro = o.id_ofe 
                    OR op.ofe_pro = o.id_ofe
                )
        )AS offers
    FROM 
        e_commerce.productos p
    INNER JOIN 
        e_commerce.cat_productos c ON p.cat_pro = c.id_cat_pro
    WHERE 
        p.id_pro LIKE p_by
        OR p.nom_pro LIKE p_by
    ORDER BY p.id_pro DESC
    LIMIT 1000;
END //

CREATE PROCEDURE e_commerce.GetProductsByCategory(
    IN p_nom_cat VARCHAR(100)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM cat_productos WHERE nom_cat_pro LIKE p_nom_cat) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La categoria no existe en el sistema';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM 
            e_commerce.productos p
        INNER JOIN
            e_commerce.cat_productos c ON p.cat_pro = c.id_cat_pro
        WHERE
            c.nom_cat_pro LIKE p_nom_cat
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No existen productos para la categoría indicada';
    END IF;

    SELECT 
        p.id_pro,
        p.nom_pro,
        p.pre_pro,
        p.des_pro,
        p.sta_pro,
        p.onSale,
        p.created_at,
        p.updated_at,
        c.nom_cat_pro,
        c.sta_cat_pro,
        (
            SELECT img.url_img
            FROM 
                productos_colores pco
            JOIN
                imagenes img ON pco.img_pro_col = img.id_img
            WHERE
                pco.pro_col_pro = p.id_pro
            LIMIT 1
        ) AS img_default,
        (
            SELECT GROUP_CONCAT(
                CONCAT_WS(';',
                    co.nom_col,
                    co.hex_col,
                    img.nom_img,
                    img.url_img
                ) 
                SEPARATOR '---'
            )
            FROM 
                productos_colores pco
            JOIN
                colores co ON pco.col_pro_col = co.id_col
            JOIN
                imagenes img ON pco.img_pro_col = img.id_img
            WHERE
                pco.pro_col_pro = p.id_pro
        ) AS colors,
        (
            SELECT GROUP_CONCAT(DISTINCT t.nom_tal_pro SEPARATOR '---')
            FROM inventario inv
            JOIN tallas t ON inv.id_tal_inv = t.id_tal_pro
            WHERE inv.id_pro_inv = p.id_pro
        ) AS sizes,
        -- Stock total del producto (sumando todas las combinaciones)
        (
            SELECT SUM(inv.cantidad)
            FROM inventario inv
            WHERE inv.id_pro_inv = p.id_pro
        ) AS stock_total,
        -- cantidad vendidad este mes
        (
            SELECT SUM(pp.can_pro_ped)
            FROM productos_pedidos pp
            JOIN pedidos pd ON pp.id_ped = pd.id_ped
            WHERE pd.fec_ped >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)
            AND pp.pro_ped = p.id_pro
            AND pd.sta_ped = 'ENTREGADO'
        ) AS ventas_mes,
        (
            SELECT GROUP_CONCAT(
                CONCAT_WS(';',
                    o.id_ofe,
                    o.nom_ofe,
                    o.des_ofe,
                    o.dur_ofe,
                    o.fec_ini_ofe,
                    o.fec_fin_ofe,
                    o.por_des_ofe,
                    o.created_at,
                    o.updated_at
                ) 
                SEPARATOR '---'
            )
            FROM
                ofertas o 
            JOIN 
                oferta_categoria_productos ocp ON ocp.cat_ofe_pro = p.cat_pro
            JOIN 
                oferta_productos op ON op.pro_ofe_pro = p.id_pro
            WHERE
                o.fec_fin_ofe > CURRENT_TIMESTAMP
                AND (
                    ocp.ofe_pro = o.id_ofe 
                    OR op.ofe_pro = o.id_ofe
                )
        )AS offers
    FROM 
        e_commerce.productos p
    INNER JOIN 
        e_commerce.cat_productos c ON p.cat_pro = c.id_cat_pro
    WHERE 
        c.nom_cat_pro LIKE p_nom_cat
        AND c.sta_cat_pro = 1
    LIMIT 1000;
END //
CREATE PROCEDURE e_commerce.RegisterProduct(
    IN p_nom_pro VARCHAR(100),
    IN p_pre_pro DECIMAL(10,2),
    IN p_des_pro TEXT,
    IN p_onSale BOOLEAN,
    IN p_nom_cat VARCHAR(100),
    IN p_slug_cat VARCHAR(100),
    IN p_colores TEXT,      -- Ejemplo: 'Rojo,Verde,Azul'
    IN p_hex_colores TEXT,  -- Ejemplo: '#FF0000,#00FF00,#0000FF'
    IN p_tallas TEXT,       -- Ejemplo: 'S,M,L'
    IN p_imgs TEXT          -- Ejemplo: 'url1.jpg,url2.jpg,url3.jpg'
)
BEGIN
    DECLARE v_id_cat INT;
    DECLARE v_id_pro INT;
    DECLARE v_id_col INT;
    DECLARE v_id_img INT;
    DECLARE v_id_tal INT;
    DECLARE v_color VARCHAR(100);
    DECLARE v_hex VARCHAR(7);
    DECLARE v_talla VARCHAR(100);
    DECLARE v_img VARCHAR(255);
    DECLARE i INT DEFAULT 1;
    DECLARE total_colores INT;
    DECLARE total_tallas INT;
    DECLARE total_imgs INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;

    START TRANSACTION;

    -- Verifica si el producto ya existe
    IF EXISTS (SELECT 1 FROM e_commerce.productos WHERE nom_pro = p_nom_pro) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El producto ya existe';
    END IF;

    -- Verifica si la categoría existe, si no la crea
    SELECT id_cat_pro INTO v_id_cat FROM e_commerce.cat_productos WHERE nom_cat_pro = p_nom_cat LIMIT 1;
    IF v_id_cat IS NULL THEN
        INSERT INTO e_commerce.cat_productos (nom_cat_pro, slug) VALUES (p_nom_cat, p_slug_cat);
        SET v_id_cat = LAST_INSERT_ID();
    END IF;

    -- Inserta el producto
    INSERT INTO e_commerce.productos (cat_pro, nom_pro, pre_pro, des_pro, onSale)
    VALUES (v_id_cat, p_nom_pro, p_pre_pro, p_des_pro, p_onSale);
    SET v_id_pro = LAST_INSERT_ID();

    -- Procesa colores e imágenes (asume que ambos tienen la misma cantidad y están separados por coma)
    SET total_colores = LENGTH(p_colores) - LENGTH(REPLACE(p_colores, ',', '')) + 1;
    SET total_imgs = LENGTH(p_imgs) - LENGTH(REPLACE(p_imgs, ',', '')) + 1;
    WHILE i <= total_colores DO
        SET v_color = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p_colores, ',', i), ',', -1));
        SET v_hex = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p_hex_colores, ',', i), ',', -1));
        SET v_img = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p_imgs, ',', i), ',', -1));

        -- Verifica si el color existe, si no lo crea
        SELECT id_col INTO v_id_col FROM e_commerce.colores WHERE nom_col = v_color OR hex_col = v_hex LIMIT 1;
        IF v_id_col IS NULL THEN
            INSERT INTO e_commerce.colores (nom_col, hex_col) VALUES (v_color, v_hex);
            SET v_id_col = LAST_INSERT_ID();
        END IF;

        -- Inserta la imagen
        INSERT INTO e_commerce.imagenes (nom_img, url_img) VALUES (CONCAT(p_nom_pro, '_', v_color), v_img);
        SET v_id_img = LAST_INSERT_ID();

        -- Inserta en productos_colores
        INSERT INTO e_commerce.productos_colores (img_pro_col, pro_col_pro, col_pro_col)
        VALUES (v_id_img, v_id_pro, v_id_col);

        SET i = i + 1;
    END WHILE;

    -- Procesa tallas
    SET i = 1;
    SET total_tallas = LENGTH(p_tallas) - LENGTH(REPLACE(p_tallas, ',', '')) + 1;
    WHILE i <= total_tallas DO
        SET v_talla = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p_tallas, ',', i), ',', -1));
        -- Verifica si la talla existe, si no la crea
        SELECT id_tal_pro INTO v_id_tal FROM e_commerce.tallas WHERE nom_tal_pro = v_talla LIMIT 1;
        IF v_id_tal IS NULL THEN
            INSERT INTO e_commerce.tallas (nom_tal_pro) VALUES (v_talla);
            SET v_id_tal = LAST_INSERT_ID();
        END IF;
        -- Inserta en productos_tallas


        SET i = i + 1;
    END WHILE;

    COMMIT;

    SET autocommit = 1;
END //
CREATE PROCEDURE e_commerce.ChangeStatusProduct(
    IN p_by VARCHAR(100)
)
BEGIN
    DECLARE p_sta_pro VARCHAR(100);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;

    START TRANSACTION;

    SELECT sta_pro INTO p_sta_pro FROM productos WHERE id_pro = p_by;

    IF (p_sta_pro) IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontró el producto en el sistema';
    END IF;

    IF (p_sta_pro LIKE 'NO-DISPONIBLE') THEN
        UPDATE productos
        SET 
            sta_pro = 'DISPONIBLE'
        WHERE 
            id_pro LIKE p_by;
    ELSE
        UPDATE productos
        SET 
            sta_pro = 'NO-DISPONIBLE'
        WHERE 
            id_pro LIKE p_by;
    END IF;

    COMMIT;

    SET autocommit = 1;
END //

/* DROP PROCEDURE e_commerce.GetAllProducts; */
/* DROP PROCEDURE e_commerce.`GetProductBy`; */
/* DROP PROCEDURE e_commerce.GetProductsCategories; */
/* DROP PROCEDURE e_commerce.`GetProductsColors`; */
/* DROP PROCEDURE e_commerce.`GetProductsSizes`; */
/* DROP PROCEDURE e_commerce.GetProductsByCategory; */
/* DROP PROCEDURE e_commerce.RegisterProduct; */
/* DROP PROCEDURE e_commerce.`ChangeStatusProduct`; */

/* CALL e_commerce.GetAllProducts(); */
/* CALL e_commerce.GetProductsCategories(); */
/* CALL e_commerce.GetProductsByCategory('Lencería'); */
/* CALL e_commerce.RegisterProduct('Lencería'); */
/* CALL e_commerce.ChangeStatusProduct('1123123123'); */
