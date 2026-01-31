-- Active: 1768620430430@@127.0.0.1@3306@e_commerce
CREATE PROCEDURE e_commerce.GetPaymentMethods()
BEGIN
    -- Verifica si hay categorias
    IF NOT EXISTS (SELECT 1 FROM metodos_pagos) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No existen métodos de pago en el sistema';
    END IF;

    SELECT
        mp.id_met_pag,
        mp.nom_met_pag,
        mp.created_at,
        mp.updated_at
    FROM metodos_pagos mp
    LIMIT 50;
END //
CREATE PROCEDURE e_commerce.GetShippingMethods()
BEGIN
    -- Verifica si hay categorias
    IF NOT EXISTS (SELECT 1 FROM metodos_envios) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No existen métodos de envío en el sistema';
    END IF;

    SELECT
        me.id_met_env,
        me.nom_met_env,
        me.des_met_env,
        me.pre_met_env,
        me.created_at,
        me.updated_at
    FROM metodos_envios me
    LIMIT 50;
END //
CREATE PROCEDURE e_commerce.GetAllOrders()
BEGIN
    -- Si no hay pedidos, mostrar señal
    IF NOT EXISTS(SELECT 1 FROM e_commerce.pedidos) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontraron pedidos en el sistema';
    ELSE
        SELECT 
            p.id_ped,
            p.fec_ped,
            p.sta_ped,
            p.dir_env_ped,
            per.id_per,
            per.nom_per,
            per.ape_per,
            per.email_per,
            per.cel_per,
            mp.nom_met_pag,
            me.nom_met_env,
            me.pre_met_env,
            me.des_met_env,
            (
                SELECT
                    SUM(pp.can_pro_ped * pr.pre_pro)
                FROM productos pr
                JOIN e_commerce.productos_pedidos pp ON pp.id_ped = p.id_ped
                WHERE pr.id_pro = pp.pro_ped
            ) AS subtotal_ped,
            (
                SELECT
                    COUNT(pr.id_pro)
                FROM productos pr
                JOIN e_commerce.productos_pedidos pp ON pp.id_ped = p.id_ped
                WHERE pr.id_pro = pp.pro_ped
            ) AS cantidad,
            (
                SELECT GROUP_CONCAT(
                    CONCAT_WS(';',
                        pr.id_pro,
                        pr.nom_pro,
                        pr.pre_pro,
                        pr.des_pro,
                        pr.sta_pro,
                        pr.onSale,
                        pp.can_pro_ped,
                        img.url_img,
                        col.nom_col,
                        col.hex_col,
                        t.nom_tal_pro
                    ) 
                    SEPARATOR '---'
                ) FROM productos pr
                JOIN e_commerce.productos_pedidos pp ON pp.id_ped = p.id_ped
                JOIN e_commerce.colores col ON pp.col_pro_ped = col.id_col
                JOIN e_commerce.imagenes img ON pp.img_pro_ped = img.id_img
                JOIN e_commerce.tallas t ON pp.tal_pro_ped = t.id_tal_pro 
                WHERE
                    pp.pro_ped = pr.id_pro
            ) AS products
        FROM 
            pedidos p
        INNER JOIN e_commerce.personas per ON p.cli_ped = per.id_per
        INNER JOIN e_commerce.metodos_pagos mp ON p.met_pag_ped = mp.id_met_pag
        INNER JOIN e_commerce.metodos_envios me ON p.met_env_ped = me.id_met_env
        GROUP BY p.id_ped
        ORDER BY p.id_ped;
    END IF;
END //

CREATE PROCEDURE e_commerce.GetOrderBy(
    IN p_by VARCHAR(100)
)
BEGIN
    -- Si no hay pedidos, mostrar señal
    IF NOT EXISTS(
        SELECT p.id_ped
        FROM 
            pedidos p
        JOIN personas per
        WHERE 
            p.id_ped LIKE p_by
            OR per.doc_per LIKE p_by
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontro el pedido en el sistema';
    ELSE
        SELECT 
            p.id_ped,
            p.fec_ped,
            p.sta_ped,
            p.dir_env_ped,
            per.id_per,
            per.nom_per,
            per.ape_per,
            per.email_per,
            per.cel_per,
            per.doc_per,
            per.gen_per,
            per.fec_cre_per,
            mp.nom_met_pag,
            me.nom_met_env,
            me.pre_met_env,
            me.des_met_env,
           (
                SELECT
                    SUM(pp.can_pro_ped * pr.pre_pro)
                FROM productos pr
                JOIN e_commerce.productos_pedidos pp ON pp.id_ped = p.id_ped
                WHERE pr.id_pro = pp.pro_ped
            ) AS subtotal_ped,
            (
                SELECT
                    COUNT(pr.id_pro)
                FROM productos pr
                JOIN e_commerce.productos_pedidos pp ON pp.id_ped = p.id_ped
                WHERE pr.id_pro = pp.pro_ped
            ) AS cantidad,
            (
                SELECT GROUP_CONCAT(
                    CONCAT_WS(';',
                        pr.id_pro,
                        pr.nom_pro,
                        pr.pre_pro,
                        pr.des_pro,
                        pr.sta_pro,
                        pr.onSale,
                        pp.can_pro_ped,
                        img.url_img,
                        col.nom_col,
                        col.hex_col,
                        t.nom_tal_pro
                    ) 
                    SEPARATOR '---'
                ) FROM productos pr
                JOIN e_commerce.productos_pedidos pp ON pp.id_ped = p.id_ped
                JOIN e_commerce.colores col ON pp.col_pro_ped = col.id_col
                JOIN e_commerce.imagenes img ON pp.img_pro_ped = img.id_img
                JOIN e_commerce.tallas t ON pp.tal_pro_ped = t.id_tal_pro 
                WHERE
                    pp.pro_ped = pr.id_pro
            ) AS products
        FROM 
            e_commerce.pedidos p
        INNER JOIN e_commerce.personas per ON p.cli_ped = per.id_per
        INNER JOIN e_commerce.metodos_pagos mp ON p.met_pag_ped = mp.id_met_pag
        INNER JOIN e_commerce.metodos_envios me ON p.met_env_ped = me.id_met_env
        WHERE
            p.id_ped LIKE p_by
            OR per.doc_per LIKE p_by
        GROUP BY p.id_ped
        ORDER BY p.id_ped;
    END IF;
END //

CREATE PROCEDURE e_commerce.RegisterOrder(
    IN p_documento_cliente VARCHAR(20),
    IN p_direccion_envio VARCHAR(200),
    IN p_metodo_pago_nombre VARCHAR(100),
    IN p_metodo_envio_nombre VARCHAR(100),
    IN p_productos_json TEXT -- TEXT para manejar strings
)
BEGIN
    DECLARE v_cliente_id INT;
    DECLARE v_metodo_pago_id INT;
    DECLARE v_metodo_envio_id INT;
    DECLARE v_pedido_id INT;
    DECLARE v_producto_count INT;
    DECLARE v_i INT DEFAULT 0;
    DECLARE v_producto_nombre VARCHAR(100);
    DECLARE v_color_nombre VARCHAR(100);
    DECLARE v_talla_nombre VARCHAR(100);
    DECLARE v_cantidad INT;
    DECLARE v_producto_id INT;
    DECLARE v_color_id INT;
    DECLARE v_talla_id INT;
    DECLARE v_imagen_id INT;
    DECLARE v_existe_pedido INT;
    DECLARE v_stock_disponible INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;

    START TRANSACTION;
    
    -- 1. Validar y obtener ID del cliente
    SELECT id_per INTO v_cliente_id FROM personas 
    WHERE doc_per = p_documento_cliente AND estado = 'DISPONIBLE';
    
    IF v_cliente_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cliente no encontradó o no disponible';
    END IF;
    
    -- 2. Validar y obtener ID del método de pago
    SELECT id_met_pag INTO v_metodo_pago_id FROM metodos_pagos 
    WHERE nom_met_pag = p_metodo_pago_nombre;
    
    IF v_metodo_pago_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Método de pago no encontradó';
    END IF;
    
    -- 3. Validar y obtener ID del método de envío
    SELECT id_met_env INTO v_metodo_envio_id FROM metodos_envios 
    WHERE nom_met_env = p_metodo_envio_nombre;
    
    IF v_metodo_envio_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Método de envío no encontradó';
    END IF;
    
    -- 4. Verificar si ya existe un pedido idéntico pendiente para este cliente
    SELECT COUNT(*) INTO v_existe_pedido FROM pedidos 
    WHERE cli_ped = v_cliente_id 
    AND dir_env_ped = p_direccion_envio 
    AND sta_ped = 'PENDIENTE'
    AND met_pag_ped = v_metodo_pago_id
    AND met_env_ped = v_metodo_envio_id;
    
    IF v_existe_pedido > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ya existe un pedido idéntico pendiente para este cliente';
    END IF;
    
    -- 5. Crear el pedido
    INSERT INTO pedidos (
        cli_ped, 
        dir_env_ped, 
        met_pag_ped, 
        met_env_ped
    ) VALUES (
        v_cliente_id, 
        p_direccion_envio, 
        v_metodo_pago_id, 
        v_metodo_envio_id
    );
    
    SET v_pedido_id = LAST_INSERT_ID();
    
     -- 6. Procesar cada producto del pedido
    SET @json_clean = REPLACE(REPLACE(p_productos_json, '\\"', '"'), '\\', '');
    SET v_producto_count = JSON_LENGTH(@json_clean);
    
    WHILE v_i < v_producto_count DO
        -- Extraer datos del producto actual
        SET @producto_path = CONCAT('$[', v_i, '].producto');
        SET @color_path = CONCAT('$[', v_i, '].color');
        SET @talla_path = CONCAT('$[', v_i, '].talla');
        SET @cantidad_path = CONCAT('$[', v_i, '].cantidad');
        
        SET v_producto_nombre = JSON_UNQUOTE(JSON_EXTRACT(@json_clean, @producto_path));
        SET v_color_nombre = JSON_UNQUOTE(JSON_EXTRACT(@json_clean, @color_path));
        SET v_talla_nombre = JSON_UNQUOTE(JSON_EXTRACT(@json_clean, @talla_path));
        SET v_cantidad = CAST(JSON_UNQUOTE(JSON_EXTRACT(@json_clean, @cantidad_path)) AS UNSIGNED);

        
        -- Obtener IDs de producto, color y talla
        SELECT p.id_pro, pc.col_pro_col, pc.img_pro_col INTO v_producto_id, v_color_id, v_imagen_id
        FROM productos p
        JOIN productos_colores pc ON p.id_pro = pc.pro_col_pro
        JOIN colores c ON pc.col_pro_col = c.id_col
        JOIN tallas t ON pc.pro_col_pro = p.id_pro -- Relación indirecta para validar talla
        WHERE p.nom_pro = v_producto_nombre 
        AND c.nom_col = v_color_nombre
        AND t.nom_tal_pro = v_talla_nombre
        AND p.sta_pro = 'DISPONIBLE'
        LIMIT 1;
        
        IF v_producto_id IS NULL THEN
            -- Primero asignas el mensaje a una variable
            SET @mensaje_error = CONCAT('Producto no disponible o no encontradó: ', v_producto_nombre, ' - ', v_color_nombre, ' - ', v_talla_nombre);

            -- Luego usas esa variable en SIGNAL
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @mensaje_error;   
        END IF;
        
        -- Obtener ID de talla específica
        SELECT id_tal_pro INTO v_talla_id FROM tallas 
        WHERE nom_tal_pro = v_talla_nombre;
        
        -- Verificar stock disponible
        SELECT cantidad INTO v_stock_disponible FROM inventario
        WHERE id_pro_inv = v_producto_id 
        AND id_col_inv = v_color_id
        AND id_tal_inv = v_talla_id;
        
        IF v_stock_disponible < v_cantidad THEN
            SET @mensaje_error = CONCAT('Stock insuficiente para el producto: ', v_producto_nombre, ' - ', v_color_nombre, ' - ', v_talla_nombre);

            -- Luego usas esa variable en SIGNAL
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @mensaje_error;   
        END IF;
        
        -- Registrar producto en el pedido
        INSERT INTO productos_pedidos (
            id_ped, 
            pro_ped, 
            col_pro_ped, 
            img_pro_ped, 
            tal_pro_ped, 
            can_pro_ped
        ) VALUES (
            v_pedido_id, 
            v_producto_id, 
            v_color_id, 
            v_imagen_id, 
            v_talla_id, 
            v_cantidad
        );
        
        -- Actualizar inventario (reducir stock)
        UPDATE inventario 
        SET cantidad = cantidad - v_cantidad
        WHERE id_pro_inv = v_producto_id 
        AND id_col_inv = v_color_id
        AND id_tal_inv = v_talla_id;
        
        SET v_i = v_i + 1;
    END WHILE;

    COMMIT;

    SET autocommit = 1;
END //

CREATE PROCEDURE e_commerce.CompleteOrder(
    IN p_by VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;

    START TRANSACTION;

    IF NOT EXISTS( SELECT 1 FROM pedidos WHERE id_ped LIKE p_by) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontró el pedido en el sistema';
    END IF;

    UPDATE 
        pedidos
    SET
        sta_ped = 'ENTREGADO',
        fec_ent_ped = CURRENT_DATE
    WHERE
        id_ped LIKE p_by;

    COMMIT;

    SET autocommit = 1;
END //

/* DROP PROCEDURE e_commerce.GetAllOrders; */
/* DROP PROCEDURE e_commerce.`GetOrderBy`; */
/* DROP PROCEDURE e_commerce.RegisterOrder; */
/* DROP PROCEDURE e_commerce.`CompleteOrder`; */

/* CALL e_commerce.GetAllOrders(); */
/* CALL e_commerce.GetOrderBy(123450989); */
/* CALL e_commerce.CompleteOrder(''); */
/* CALL e_commerce.RegisterOrder(
    '10293908',
    'Calle 123, Ciudad, País',
    'Tarjeta de Crédito',
    'Servientrega',
    '[
        {
            "producto": "Camiseta Premium",
            "color": "Negro",
            "talla": "M",
            "cantidad": 2
        },
        {
            "producto": "Pantalón Jeans",
            "color": "Azul",
            "talla": 32,
            "cantidad": 1
        }
    ]'
); */