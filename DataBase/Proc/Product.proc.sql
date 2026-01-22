-- Active: 1768620430430@@127.0.0.1@3306@e_commerce
CREATE PROCEDURE e_commerce.GetProductsCategories()
BEGIN
    -- Verifica si hay categorias
    IF NOT EXISTS (SELECT 1 FROM cat_productos) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La categoria no existe en el sistema';
    END IF;

    SELECT
        c.id_cat_pro,
        c.nom_cat_pro,
        c.des_cat_pro,
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
        c.hex_col,
        i.url_img
    FROM productos_colores pc
    JOIN colores c ON pc.col_pro_col = c.id_col
    JOIN imagenes i ON pc.img_pro_col = i.id_img
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
CREATE PROCEDURE e_commerce.GetProductsBrands()
BEGIN
    -- Verifica si hay tallas
    IF NOT EXISTS (SELECT 1 FROM marcas_productos) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No existen marcas en el sistema';
    END IF;

    SELECT
        mp.id_mar,
        mp.nom_mar,
        mp.created_at,
        mp.updated_at
    FROM marcas_productos mp
    LIMIT 1000;
END //
CREATE PROCEDURE e_commerce.GetAllProducts()
BEGIN
    IF NOT EXISTS (SELECT 1 FROM e_commerce.productos) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No existen productos registrados';
    END IF;

    SELECT 
        p.*,
        mp.nom_mar,
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
                    img.url_img,
                    (
                        SELECT SUM(inv.cantidad) FROM inventario inv
                        WHERE inv.id_pro_inv = p.id_pro AND inv.id_col_inv = co.id_col
                    )
                ) 
                SEPARATOR '---'
            )
            FROM 
                productos_colores pco
            JOIN
                colores co ON pco.col_pro_col = co.id_col
            JOIN
                imagenes img ON img.id_img = pco.img_pro_col
            WHERE
                pco.pro_col_pro = p.id_pro
        ) AS colors,
        -- Inventario del producto
        (
            SELECT GROUP_CONCAT(
                CONCAT_WS(';',
                    inv.id_inv,
                    co.nom_col,
                    co.hex_col,
                    inv.cantidad,
                    tpInv.nom_tal_pro
                ) 
                SEPARATOR '---'
            )
            FROM 
                inventario inv 
            JOIN
                colores co ON inv.id_col_inv = co.id_col
            JOIN
                tallas tpInv ON tpInv.id_tal_pro = inv.id_tal_inv
            JOIN
                productos p ON p.id_pro = inv.id_pro_inv
            WHERE
                inv.id_pro_inv = p.id_pro
        ) AS inv,
        -- Tallas disponibles para el producto (por inventario)
        (
            SELECT GROUP_CONCAT(DISTINCT t.nom_tal_pro SEPARATOR '---')
            FROM inventario inv
            JOIN tallas t ON inv.id_tal_inv = t.id_tal_pro
            WHERE inv.id_pro_inv = p.id_pro
        ) AS sizes,
        -- Stock total del producto (sumando todas las combinaciones)
        (
            SELECT IFNULL(SUM(inv.cantidad), 0)
            FROM inventario inv
            WHERE inv.id_pro_inv = p.id_pro
        ) AS stock_total,
        -- cantidad vendidad este mes
        (
            SELECT IFNULL(SUM(pp.can_pro_ped), 0)
            FROM productos_pedidos pp
            JOIN pedidos pd ON pp.id_ped = pd.id_ped
            WHERE pd.fec_ped >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)
            AND pp.pro_ped = p.id_pro
            AND pd.sta_ped = 'ENTREGADO'
        ) AS ventas_mes,
        CASE 
            WHEN EXISTS (SELECT 1 FROM oferta_categoria_productos WHERE cat_ofe_pro = p.cat_pro) THEN
                (SELECT GROUP_CONCAT(
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
                WHERE 
                    o.fec_fin_ofe > CURRENT_TIMESTAMP
                    AND ocp.ofe_pro = o.id_ofe)
            ELSE
                (SELECT GROUP_CONCAT(
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
                    oferta_productos op ON op.pro_ofe_pro = p.id_pro
                WHERE
                    o.fec_fin_ofe > CURRENT_TIMESTAMP
                    AND op.ofe_pro = o.id_ofe)
        END AS offers
    FROM 
        e_commerce.productos p
    INNER JOIN 
        e_commerce.cat_productos c ON p.cat_pro = c.id_cat_pro
    JOIN
        e_commerce.marcas_productos mp ON mp.id_mar = p.mar_pro
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
        mp.nom_mar,
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
                    img.url_img,
                    (
                        SELECT SUM(inv.cantidad) FROM inventario inv
                        WHERE inv.id_pro_inv = p.id_pro AND inv.id_col_inv = co.id_col
                    )
                ) 
                SEPARATOR '---'
            )
            FROM 
                productos_colores pco
            JOIN
                colores co ON pco.col_pro_col = co.id_col
            JOIN
                imagenes img ON img.id_img = pco.img_pro_col
            WHERE
                pco.pro_col_pro = p.id_pro
        ) AS colors,
        -- Inventario del producto
        (
            SELECT GROUP_CONCAT(
                CONCAT_WS(';',
                    inv.id_inv,
                    co.nom_col,
                    co.hex_col,
                    inv.cantidad,
                    tpInv.nom_tal_pro
                ) 
                SEPARATOR '---'
            )
            FROM 
                inventario inv 
            JOIN
                colores co ON inv.id_col_inv = co.id_col
            JOIN
                tallas tpInv ON tpInv.id_tal_pro = inv.id_tal_inv
            JOIN
                productos p ON p.id_pro = inv.id_pro_inv
            WHERE
                inv.id_pro_inv = p.id_pro
        ) AS inv,
        -- Tallas disponibles para el producto (por inventario)
        (
            SELECT GROUP_CONCAT(DISTINCT t.nom_tal_pro SEPARATOR '---')
            FROM inventario inv
            JOIN tallas t ON inv.id_tal_inv = t.id_tal_pro
            WHERE inv.id_pro_inv = p.id_pro
        ) AS sizes,
        -- Stock total del producto (sumando todas las combinaciones)
        (
            SELECT IFNULL(SUM(inv.cantidad), 0)
            FROM inventario inv
            WHERE inv.id_pro_inv = p.id_pro
        ) AS stock_total,
        -- cantidad vendidad este mes
        (
            SELECT IFNULL(SUM(pp.can_pro_ped), 0)
            FROM productos_pedidos pp
            JOIN pedidos pd ON pp.id_ped = pd.id_ped
            WHERE pd.fec_ped >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)
            AND pp.pro_ped = p.id_pro
            AND pd.sta_ped = 'ENTREGADO'
        ) AS ventas_mes,
        CASE 
            WHEN EXISTS (SELECT 1 FROM oferta_categoria_productos WHERE cat_ofe_pro = p.cat_pro) THEN
                (SELECT GROUP_CONCAT(
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
                WHERE 
                    o.fec_fin_ofe > CURRENT_TIMESTAMP
                    AND ocp.ofe_pro = o.id_ofe)
            ELSE
                (SELECT GROUP_CONCAT(
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
                    oferta_productos op ON op.pro_ofe_pro = p.id_pro
                WHERE
                    o.fec_fin_ofe > CURRENT_TIMESTAMP
                    AND op.ofe_pro = o.id_ofe)
        END AS offers
    FROM 
        e_commerce.productos p
    INNER JOIN 
        e_commerce.cat_productos c ON p.cat_pro = c.id_cat_pro
    JOIN
        e_commerce.marcas_productos mp ON mp.id_mar = p.mar_pro
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
        p.*,
        mp.nom_mar,
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
                    img.url_img,
                    (
                        SELECT SUM(inv.cantidad) FROM inventario inv
                        WHERE inv.id_pro_inv = p.id_pro AND inv.id_col_inv = co.id_col
                    )
                ) 
                SEPARATOR '---'
            )
            FROM 
                productos_colores pco
            JOIN
                colores co ON pco.col_pro_col = co.id_col
            JOIN
                imagenes img ON img.id_img = pco.img_pro_col
            WHERE
                pco.pro_col_pro = p.id_pro
        ) AS colors,
        -- Inventario del producto
        (
            SELECT GROUP_CONCAT(
                CONCAT_WS(';',
                    inv.id_inv,
                    co.nom_col,
                    co.hex_col,
                    inv.cantidad,
                    tpInv.nom_tal_pro
                ) 
                SEPARATOR '---'
            )
            FROM 
                inventario inv 
            JOIN
                colores co ON inv.id_col_inv = co.id_col
            JOIN
                tallas tpInv ON tpInv.id_tal_pro = inv.id_tal_inv
            JOIN
                productos p ON p.id_pro = inv.id_pro_inv
            WHERE
                inv.id_pro_inv = p.id_pro
        ) AS inv,
        (
            SELECT GROUP_CONCAT(DISTINCT t.nom_tal_pro SEPARATOR '---')
            FROM inventario inv
            JOIN tallas t ON inv.id_tal_inv = t.id_tal_pro
            WHERE inv.id_pro_inv = p.id_pro
        ) AS sizes,
        -- Stock total del producto (sumando todas las combinaciones)
        (
            SELECT IFNULL(SUM(inv.cantidad), 0)
            FROM inventario inv
            WHERE inv.id_pro_inv = p.id_pro
        ) AS stock_total,
        -- cantidad vendidad este mes
        (
            SELECT IFNULL(SUM(pp.can_pro_ped), 0)
            FROM productos_pedidos pp
            JOIN pedidos pd ON pp.id_ped = pd.id_ped
            WHERE pd.fec_ped >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)
            AND pp.pro_ped = p.id_pro
            AND pd.sta_ped = 'ENTREGADO'
        ) AS ventas_mes,
        CASE 
            WHEN EXISTS (SELECT 1 FROM oferta_categoria_productos WHERE cat_ofe_pro = p.cat_pro) THEN
                (SELECT GROUP_CONCAT(
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
                WHERE 
                    o.fec_fin_ofe > CURRENT_TIMESTAMP
                    AND ocp.ofe_pro = o.id_ofe)
            ELSE
                (SELECT GROUP_CONCAT(
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
                    oferta_productos op ON op.pro_ofe_pro = p.id_pro
                WHERE
                    o.fec_fin_ofe > CURRENT_TIMESTAMP
                    AND op.ofe_pro = o.id_ofe)
        END AS offers
    FROM
        e_commerce.productos p
    INNER JOIN
        e_commerce.cat_productos c ON p.cat_pro = c.id_cat_pro
    JOIN
        e_commerce.marcas_productos mp ON mp.id_mar = p.mar_pro
    WHERE
        c.nom_cat_pro LIKE p_nom_cat
        AND c.sta_cat_pro = 1
    LIMIT 1000;
END //
CREATE PROCEDURE e_commerce.RegisterProduct(
    IN p_nom_pro VARCHAR(100),
    IN p_pre_ori_pro DECIMAL(10,2),
    IN p_pre_pro DECIMAL(10,2),
    IN p_des_pre_pro INT,
    IN p_des_pro TEXT,
    IN p_onSale BOOLEAN,
    IN p_nom_cat VARCHAR(100),
    IN p_slug_cat VARCHAR(100),
    IN p_nom_mar VARCHAR(100),
    IN p_colores_imgs_json TEXT, -- '[{"nom_col":"Negro","hex_col":"#000000","nom_img":"img_14_2","url_img":"url_14_2"}, ...]'
    IN p_inventarios_json TEXT   -- '[{"nom_col":"Negro","stock":12,"size":"34"}, ...]'
)
BEGIN
    DECLARE v_id_cat INT;
    DECLARE v_id_pro INT;
    DECLARE v_id_col INT;
    DECLARE v_id_img INT;
    DECLARE v_id_mar INT;
    DECLARE v_color VARCHAR(100);
    DECLARE v_hex VARCHAR(200);
    DECLARE v_nom_img VARCHAR(255);
    DECLARE v_url_img VARCHAR(255);
    DECLARE v_inv INT;
    DECLARE i INT DEFAULT 0;
    DECLARE total_colores INT;
    DECLARE total_inv INT;
    DECLARE inv_nom_col VARCHAR(100);
    DECLARE inv_cantidad INT;
    DECLARE inv_size VARCHAR(100);
    DECLARE inv_id_col INT;
    DECLARE inv_id_tal INT;
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

    -- Verifica si la marca existe, si no la crea
    SELECT id_mar INTO v_id_mar FROM e_commerce.marcas_productos WHERE nom_mar = p_nom_mar LIMIT 1;
    IF v_id_mar IS NULL THEN
        INSERT INTO e_commerce.marcas_productos (nom_mar) VALUES (p_nom_mar);
        SET v_id_mar = LAST_INSERT_ID();
    END IF;

    -- Inserta el producto
    INSERT INTO e_commerce.productos (
        cat_pro, nom_pro, mar_pro, pre_ori_pro, pre_pro, des_pre_pro, des_pro, onSale
    )
    VALUES (
        v_id_cat, p_nom_pro, v_id_mar, p_pre_ori_pro, p_pre_pro, p_des_pre_pro, p_des_pro, p_onSale
    );
    SET v_id_pro = LAST_INSERT_ID();

    IF (p_colores_imgs_json) IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El producto no puede estar sin colores';
    END IF;
    -- Procesa colores e imágenes desde JSON
    SET total_colores = JSON_LENGTH(p_colores_imgs_json);
    SET i = 0;
    WHILE i < total_colores DO
        SET v_color = JSON_UNQUOTE(JSON_EXTRACT(p_colores_imgs_json, CONCAT('$[',i,'].nom_col')));
        SET v_hex = JSON_UNQUOTE(JSON_EXTRACT(p_colores_imgs_json, CONCAT('$[',i,'].hex_col')));
        SET v_nom_img = JSON_UNQUOTE(JSON_EXTRACT(p_colores_imgs_json, CONCAT('$[',i,'].nom_img')));
        SET v_url_img = JSON_UNQUOTE(JSON_EXTRACT(p_colores_imgs_json, CONCAT('$[',i,'].url_img')));

        -- Verifica si el color existe, si no lo crea
        SELECT id_col INTO v_id_col FROM e_commerce.colores WHERE nom_col = v_color OR hex_col = v_hex LIMIT 1;
        IF v_id_col IS NULL THEN
            INSERT INTO e_commerce.colores (nom_col, hex_col) VALUES (v_color, v_hex);
            SET v_id_col = LAST_INSERT_ID();
        END IF;

        -- Inserta la imagen si no existe
        SELECT id_img INTO v_id_img FROM imagenes
        WHERE url_img = v_url_img OR nom_img LIKE v_nom_img LIMIT 1;
        IF (v_id_img) IS NULL THEN
            INSERT INTO e_commerce.imagenes (nom_img, url_img) VALUES (v_nom_img, v_url_img);
            SET v_id_img = LAST_INSERT_ID();
        END IF;

        IF NOT EXISTS(
            SELECT 1 FROM productos_colores 
            WHERE v_id_col = col_pro_col 
            AND pro_col_pro = v_id_pro
        ) THEN
            -- Inserta en productos_colores
            INSERT INTO e_commerce.productos_colores (img_pro_col, pro_col_pro, col_pro_col)
            VALUES (v_id_img, v_id_pro, v_id_col);
        END IF;

        SET i = i + 1;
    END WHILE;

    -- Procesa inventario desde JSON (cada objeto tiene nom_col, stock, size)
    IF NOT (p_inventarios_json) IS NULL THEN
        SET total_inv = JSON_LENGTH(p_inventarios_json);
        SET i = 0;
        WHILE i < total_inv DO
            SET inv_nom_col = JSON_UNQUOTE(JSON_EXTRACT(p_inventarios_json, CONCAT('$[',i,'].nom_col')));
            SET inv_cantidad = CAST(JSON_UNQUOTE(JSON_EXTRACT(p_inventarios_json, CONCAT('$[',i,'].stock'))) AS SIGNED);
            SET inv_size = JSON_UNQUOTE(JSON_EXTRACT(p_inventarios_json, CONCAT('$[',i,'].size')));

            -- Busca id_col
            SELECT id_col INTO inv_id_col FROM e_commerce.colores WHERE nom_col = inv_nom_col LIMIT 1;
            -- Busca id_tal
            SELECT id_tal_pro INTO inv_id_tal FROM e_commerce.tallas WHERE nom_tal_pro = inv_size LIMIT 1;
            IF inv_id_tal IS NULL THEN
                INSERT INTO e_commerce.tallas (nom_tal_pro) VALUES (inv_size);
                SET inv_id_tal = LAST_INSERT_ID();
            END IF;

            -- Inserta en inventario
            INSERT INTO e_commerce.inventario (id_pro_inv, id_col_inv, id_tal_inv, cantidad)
            VALUES (v_id_pro, inv_id_col, inv_id_tal, inv_cantidad);

            SET i = i + 1;
        END WHILE;
    END IF;

    COMMIT;
    SET autocommit = 1;
END //

CREATE PROCEDURE e_commerce.ModifyProduct(
    IN p_id_pro INT,
    IN p_nom_pro VARCHAR(100),
    IN p_pre_ori_pro DECIMAL(10,2),
    IN p_pre_pro DECIMAL(10,2),
    IN p_des_pre_pro INT,
    IN p_des_pro TEXT,
    IN p_onSale BOOLEAN,
    IN p_sta_pro ENUM('DISPONIBLE','NO-DISPONIBLE'),
    IN p_nom_cat VARCHAR(100),
    IN p_slug_cat VARCHAR(100),
    IN p_nom_mar VARCHAR(100),
    IN p_colores_imgs_json TEXT, -- '[{"nom_col":"Negro","hex_col":"#000000","nom_img":"img_14_2","url_img":"url_14_2"}, ...]'
    IN p_inventarios_json TEXT   -- '[{"nom_col":"Negro","cantidad":12,"size":"34"}, ...]'
)
BEGIN
    DECLARE v_id_cat INT;
    DECLARE v_id_col INT;
    DECLARE v_id_img INT;
    DECLARE v_id_mar INT;
    DECLARE v_color VARCHAR(100);
    DECLARE v_hex VARCHAR(200);
    DECLARE v_nom_img VARCHAR(255);
    DECLARE v_url_img VARCHAR(255);
    DECLARE v_inv INT;
    DECLARE i INT DEFAULT 0;
    DECLARE j INT DEFAULT 0;
    DECLARE total_colores INT;
    DECLARE total_inv INT;
    DECLARE inv_nom_col VARCHAR(100);
    DECLARE inv_cantidad INT;
    DECLARE inv_size VARCHAR(100);
    DECLARE inv_id_col INT;
    DECLARE inv_id_tal INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;
    START TRANSACTION;

    -- Verifica si el producto existe
    IF NOT EXISTS (SELECT 1 FROM e_commerce.productos WHERE id_pro = p_id_pro) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El producto no existe';
    END IF;

    -- Verifica si la categoría existe, si no la crea
    SELECT id_cat_pro INTO v_id_cat FROM e_commerce.cat_productos WHERE nom_cat_pro = p_nom_cat LIMIT 1;
    IF v_id_cat IS NULL THEN
        INSERT INTO e_commerce.cat_productos (nom_cat_pro, slug) VALUES (p_nom_cat, p_slug_cat);
        SET v_id_cat = LAST_INSERT_ID();
    END IF;

    -- Verifica si la marca existe, si no la crea
    SELECT id_mar INTO v_id_mar FROM e_commerce.marcas_productos WHERE nom_mar = p_nom_mar LIMIT 1;
    IF v_id_mar IS NULL THEN
        INSERT INTO e_commerce.marcas_productos (nom_mar) VALUES (p_nom_mar);
        SET v_id_mar = LAST_INSERT_ID();
    END IF;

    -- Actualiza el producto
    UPDATE e_commerce.productos
    SET cat_pro = v_id_cat,
        nom_pro = p_nom_pro,
        mar_pro = v_id_mar,
        pre_ori_pro = p_pre_ori_pro,
        pre_pro = p_pre_pro,
        des_pre_pro = p_des_pre_pro,
        des_pro = p_des_pro,
        onSale = p_onSale,
        sta_pro = p_sta_pro,
        updated_at = CURRENT_TIMESTAMP
    WHERE id_pro = p_id_pro;

    -- Elimina relaciones antiguas de colores, imágenes y tallas
    /* DELETE FROM e_commerce.productos_colores WHERE pro_col_pro = p_id_pro;
    DELETE FROM e_commerce.inventario WHERE id_pro_inv = p_id_pro; */

    IF (p_colores_imgs_json) IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El producto no puede estar sin colores';
    END IF;

    -- Procesa colores e imágenes desde JSON
    SET total_colores = JSON_LENGTH(p_colores_imgs_json);
    SET i = 0;
    WHILE i < total_colores DO
        SET v_color = JSON_UNQUOTE(JSON_EXTRACT(p_colores_imgs_json, CONCAT('$[',i,'].nom_col')));
        SET v_hex = JSON_UNQUOTE(JSON_EXTRACT(p_colores_imgs_json, CONCAT('$[',i,'].hex_col')));
        SET v_nom_img = JSON_UNQUOTE(JSON_EXTRACT(p_colores_imgs_json, CONCAT('$[',i,'].nom_img')));
        SET v_url_img = JSON_UNQUOTE(JSON_EXTRACT(p_colores_imgs_json, CONCAT('$[',i,'].url_img')));

        -- Verifica si el color existe, si no lo crea
        SELECT id_col INTO v_id_col FROM e_commerce.colores WHERE nom_col = v_color OR hex_col = v_hex LIMIT 1;
        IF v_id_col IS NULL THEN
            INSERT INTO e_commerce.colores (nom_col, hex_col) VALUES (v_color, v_hex);
            SET v_id_col = LAST_INSERT_ID();
        END IF;

        -- Inserta la imagen si no existe
        SELECT id_img INTO v_id_img FROM imagenes
        WHERE url_img = v_url_img OR nom_img LIKE v_nom_img LIMIT 1;
        IF (v_id_img) IS NULL THEN
            INSERT INTO e_commerce.imagenes (nom_img, url_img) VALUES (v_nom_img, v_url_img);
            SET v_id_img = LAST_INSERT_ID();
        END IF;

        IF NOT EXISTS(
            SELECT 1 FROM productos_colores 
            WHERE v_id_col = col_pro_col 
            AND pro_col_pro = p_id_pro
        ) THEN
            -- Inserta en productos_colores
            INSERT INTO e_commerce.productos_colores (img_pro_col, pro_col_pro, col_pro_col)
            VALUES (v_id_img, p_id_pro, v_id_col);
        END IF;

        SET i = i + 1;
    END WHILE;

    IF NOT (p_inventarios_json) IS NULL THEN
        -- Procesa inventario desde JSON (cada objeto tiene nom_col, cantidad, size)
        SET total_inv = JSON_LENGTH(p_inventarios_json);
        SET i = 0;
        WHILE i < total_inv DO
            SET inv_nom_col = JSON_UNQUOTE(JSON_EXTRACT(p_inventarios_json, CONCAT('$[',i,'].nom_col')));
            SET inv_cantidad = CAST(JSON_UNQUOTE(JSON_EXTRACT(p_inventarios_json, CONCAT('$[',i,'].stock'))) AS SIGNED);
            SET inv_size = JSON_UNQUOTE(JSON_EXTRACT(p_inventarios_json, CONCAT('$[',i,'].size')));

            -- Busca id_col
            SELECT id_col INTO inv_id_col FROM e_commerce.colores WHERE nom_col = inv_nom_col LIMIT 1;
            -- Busca id_tal
            SELECT id_tal_pro INTO inv_id_tal FROM e_commerce.tallas WHERE nom_tal_pro = inv_size LIMIT 1;
            IF inv_id_tal IS NULL THEN
                INSERT INTO e_commerce.tallas (nom_tal_pro) VALUES (inv_size);
                SET inv_id_tal = LAST_INSERT_ID();
            END IF;

            IF EXISTS (
                SELECT 1 FROM inventario 
                WHERE id_pro_inv = p_id_pro 
                AND id_col_inv = inv_id_col
                AND id_tal_inv = inv_id_tal
            ) THEN
                UPDATE inventario
                SET cantidad = inv_cantidad
                WHERE
                    id_pro_inv = p_id_pro 
                    AND id_col_inv = inv_id_col
                    AND id_tal_inv = inv_id_tal;
            ELSE
                -- Inserta en inventario
                INSERT INTO e_commerce.inventario (id_pro_inv, id_col_inv, id_tal_inv, cantidad)
                VALUES (p_id_pro, inv_id_col, inv_id_tal, inv_cantidad);
            END IF;

            SET i = i + 1;
        END WHILE;
    END IF;

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

/* DROP PROCEDURE e_commerce.GetProductsCategories; */
/* DROP PROCEDURE e_commerce.`GetProductsColors`; */
/* DROP PROCEDURE e_commerce.`GetProductsSizes`; */
/* DROP PROCEDURE e_commerce.`GetProductsBrands`; */
/* DROP PROCEDURE e_commerce.GetAllProducts; */
/* DROP PROCEDURE e_commerce.`GetProductBy`; */
/* DROP PROCEDURE e_commerce.GetProductsByCategory; */
/* DROP PROCEDURE e_commerce.`ChangeStatusProduct`; */
/* DROP PROCEDURE e_commerce.RegisterProduct; */
/* DROP PROCEDURE e_commerce.ModifyProduct; */

/* CALL e_commerce.GetProductsBrands(); */
/* CALL e_commerce.GetProductsCategories(); */
/* CALL e_commerce.GetAllProducts(); */
/* CALL e_commerce.GetProductBy(19); */
/* CALL e_commerce.GetProductsByCategory('Lencería'); */
/* CALL e_commerce.RegisterProduct('Lencería'); */
/* CALL e_commerce.ChangeStatusProduct('1123123123'); */