-- Active: 1761607626419@@127.0.0.1@3306@e_commerce
CREATE PROCEDURE e_commerce.GetAllOffers()
BEGIN
    IF NOT EXISTS (SELECT * FROM e_commerce.ofertas LIMIT 1) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No hay ofertas disponibles';
    END IF;

    SELECT
        of.id_ofe,
        of.nom_ofe,
        of.des_ofe,
        of.dur_ofe,
        of.fec_ini_ofe,
        of.fec_fin_ofe,
        of.por_des_ofe,
        of.sta_ofe,
        of.available,
        of.created_at,
        of.updated_at,
        (
            SELECT GROUP_CONCAT(
                CONCAT_WS(';',
                    cp.id_cat_pro,
                    cp.nom_cat_pro,
                    cp.slug,
                    cp.des_cat_pro,
                    cp.sta_cat_pro,
                    cp.created_at,
                    cp.updated_at
                )
                SEPARATOR '---'
            ) FROM 
                cat_productos cp
            JOIN
                e_commerce.oferta_categoria_productos oc ON oc.ofe_pro = of.id_ofe
            WHERE 
                cp.id_cat_pro = oc.cat_ofe_pro
        ) AS Categories,
        (
            SELECT GROUP_CONCAT(
                CONCAT_WS(';',
                    p.id_pro,
                    p.nom_pro,
                    p.des_pro,
                    p.pre_pro,
                    p.sta_pro,
                    p.created_at,
                    p.updated_at
                )
                SEPARATOR '---'
            )FROM
                productos p
            JOIN
                e_commerce.oferta_productos op ON op.ofe_pro = of.id_ofe
            WHERE 
                p.id_pro = op.pro_ofe_pro
        ) AS Products
    FROM 
        e_commerce.ofertas of
    WHERE
        of.available = 1
    LIMIT 1000;
END //

CREATE PROCEDURE e_commerce.GetOfferProduct()
BEGIN
    IF NOT EXISTS (SELECT * FROM e_commerce.ofertas LIMIT 1) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No hay productos en ofertas';
    END IF;

    SELECT
        of.id_ofe,
        of.nom_ofe,
        of.des_ofe,
        of.dur_ofe,
        of.fec_ini_ofe,
        of.fec_fin_ofe,
        of.por_des_ofe,
        of.sta_ofe,
        of.available,
        of.created_at,
        of.updated_at,
        p.id_pro,
        p.nom_pro,
        p.des_pro,
        p.pre_pro,
        p.sta_pro,
        p.created_at,
        p.updated_at,
        cp.nom_cat_pro,
        cp.des_cat_pro,
        cp.slug,
        (
            SELECT img.url_img
            FROM 
                productos_colores pco
            JOIN
                imagenes img ON pco.img_pro_col = img.id_img
            WHERE
                pco.pro_col_pro = p.id_pro
            LIMIT 1
        ) AS img_default
    FROM 
        e_commerce.ofertas of
    JOIN
        e_commerce.oferta_productos op ON op.ofe_pro = of.id_ofe
    JOIN
        e_commerce.productos p ON p.id_pro = op.pro_ofe_pro
    JOIN
        e_commerce.cat_productos cp ON cp.id_cat_pro = p.cat_pro
    WHERE
        of.available = 1
        AND of.fec_fin_ofe > CURRENT_TIMESTAMP
    LIMIT 1;
END //

CREATE PROCEDURE e_commerce.ChangeStateOffer(
    IN p_by VARCHAR(100)
)
BEGIN
    DECLARE v_id_ofe INT;
    DECLARE v_sta_ofe ENUM('PENDIENTE', 'ACTIVA', 'FINALIZADA');
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;

    START TRANSACTION;

    SELECT id_ofe, sta_ofe INTO v_id_ofe, v_sta_ofe
    FROM e_commerce.ofertas
    WHERE id_ofe = p_by;

    IF v_id_ofe IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Oferta no encontrada';
    END IF;

    IF v_sta_ofe = 'PENDIENTE' THEN
        UPDATE e_commerce.ofertas SET sta_ofe = 'ACTIVA' WHERE id_ofe = v_id_ofe;
    ELSEIF v_sta_ofe = 'ACTIVA' THEN
        UPDATE e_commerce.ofertas SET sta_ofe = 'FINALIZADA' WHERE id_ofe = v_id_ofe;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Estado de oferta no válido';
    END IF;

    COMMIT;

    SET autocommit = 0;
END //

CREATE PROCEDURE e_commerce.DeactivateOffer(
    IN p_by VARCHAR(100)
)
BEGIN
    DECLARE v_id_ofe INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;

    START TRANSACTION;

    SELECT id_ofe INTO v_id_ofe
    FROM e_commerce.ofertas
    WHERE id_ofe = p_by;

    IF v_id_ofe IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Oferta no encontrada';
    END IF;

    UPDATE e_commerce.ofertas SET available = 0 WHERE id_ofe = v_id_ofe;

    COMMIT;

    SET autocommit = 1;
END //

CREATE PROCEDURE e_commerce.RegisterOffer(
    IN p_nombre_oferta VARCHAR(255),
    IN p_descripcion TEXT,
    IN p_duracion_horas INT,
    IN p_fecha_inicio TIMESTAMP,
    IN p_fecha_fin TIMESTAMP,
    IN p_porcentaje_descuento INT,
    IN p_productos_json JSON, -- JSON array de IDs de productos: [1, 2, 3]
    IN p_categorias_json JSON -- JSON array de IDs de categorías: [1, 2]
)
BEGIN
    DECLARE v_oferta_id INT;
    DECLARE v_producto_count INT;
    DECLARE v_categoria_count INT;
    DECLARE v_i INT DEFAULT 0;
    DECLARE v_sta_ofe VARCHAR(100) DEFAULT 'PENDIENTE';
    DECLARE v_producto_id INT;
    DECLARE v_categoria_id INT;
    DECLARE v_producto_valido BOOLEAN;
    DECLARE v_categoria_valida BOOLEAN;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;

    START TRANSACTION;
    
    -- Validar parámetros obligatorios
    IF EXISTS (SELECT 1 FROM ofertas WHERE nom_ofe = p_nombre_oferta LIMIT 1) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Nombre de oferta ya existe';
    END IF;
    
    -- Validar que al menos haya productos o categorías
    IF (p_productos_json IS NULL OR JSON_LENGTH(p_productos_json) = 0) AND 
       (p_categorias_json IS NULL OR JSON_LENGTH(p_categorias_json) = 0) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Debe proporcionar al menos un producto o una categoría';
    END IF;

    IF (p_fecha_inicio >= CURRENT_DATE)
        THEN SET v_sta_ofe = 'ACTIVA';
    END IF;
    
    -- Insertar la nueva oferta
    INSERT INTO e_commerce.ofertas (
        nom_ofe, 
        des_ofe, 
        dur_ofe, 
        fec_ini_ofe, 
        fec_fin_ofe, 
        por_des_ofe
    ) VALUES (
        p_nombre_oferta,
        p_descripcion,
        p_duracion_horas,
        p_fecha_inicio,
        p_fecha_fin,
        p_porcentaje_descuento
    );
    
    SET v_oferta_id = LAST_INSERT_ID();
    
    -- Procesar productos si se proporcionan
    IF p_productos_json IS NOT NULL AND JSON_LENGTH(p_productos_json) > 0 THEN
        SET v_producto_count = JSON_LENGTH(p_productos_json);
        
        WHILE v_i < v_producto_count DO
            SET v_producto_id = JSON_EXTRACT(p_productos_json, CONCAT('$[', v_i, ']'));
            
            -- Verificar si el producto existe y está disponible
            SELECT COUNT(*) INTO v_producto_valido FROM productos 
            WHERE id_pro = v_producto_id AND sta_pro = 'DISPONIBLE';
            
            IF v_producto_valido THEN
                -- Insertar relación oferta-producto
                INSERT INTO e_commerce.oferta_productos (ofe_pro, pro_ofe_pro)
                VALUES (v_oferta_id, v_producto_id);
                
                -- Actualizar descuento en el producto si la oferta está activa
                IF v_sta_ofe = 'ACTIVA' THEN
                    UPDATE productos 
                    SET des_pre_pro = p_porcentaje_descuento,
                        pre_pro = pre_ori_pro * (1 - p_porcentaje_descuento/100)
                    WHERE id_pro = v_producto_id;
                END IF;
            ELSE
                SET @mensaje_error = CONCAT('El producto ', v_producto_id, ' no fue encontrado');
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @error_message;
            END IF;
            
            SET v_i = v_i + 1;
        END WHILE;
    END IF;
    
    -- Procesar categorías si se proporcionan
    IF p_categorias_json IS NOT NULL AND JSON_LENGTH(p_categorias_json) > 0 THEN
        SET v_i = 0;
        SET v_categoria_count = JSON_LENGTH(p_categorias_json);
        
        WHILE v_i < v_categoria_count DO
            SET v_categoria_id = JSON_EXTRACT(p_categorias_json, CONCAT('$[', v_i, ']'));
            
            -- Verificar si la categoría existe y está activa
            SELECT COUNT(*) INTO v_categoria_valida FROM cat_productos 
            WHERE id_cat_pro = v_categoria_id AND sta_cat_pro = 1;
            
            IF v_categoria_valida THEN
                -- Insertar relación oferta-categoría
                INSERT INTO e_commerce.oferta_categoria_productos (ofe_pro, cat_ofe_pro)
                VALUES (v_oferta_id, v_categoria_id);
                -- Actualizar descuento en el producto si la oferta está activa
            END IF;
            
            SET v_i = v_i + 1;
        END WHILE;
        IF v_sta_ofe = 'ACTIVA' THEN
            UPDATE productos 
            SET des_pre_pro = p_porcentaje_descuento,
                pre_pro = pre_ori_pro * (1 - p_porcentaje_descuento/100)
            WHERE cat_pro = v_categoria_id;
        END IF;
    END IF;

    COMMIT;

    SET autocommit = 1;
END //

CREATE PROCEDURE e_commerce.ModifyOffer(
    IN p_id_oferta INT,
    IN p_nombre_oferta VARCHAR(255),
    IN p_descripcion TEXT,
    IN p_duracion_horas INT,
    IN p_fecha_inicio TIMESTAMP,
    IN p_fecha_fin TIMESTAMP,
    IN p_porcentaje_descuento INT,
    IN p_productos_json JSON, -- JSON array de IDs de productos: [1, 2, 3]
    IN p_categorias_json JSON -- JSON array de IDs de categorías: [1, 2]
)
BEGIN
    DECLARE v_producto_count INT;
    DECLARE v_categoria_count INT;
    DECLARE v_i INT DEFAULT 0;
    DECLARE v_producto_id INT;
    DECLARE v_categoria_id INT;
    DECLARE v_producto_valido BOOLEAN;
    DECLARE v_categoria_valida BOOLEAN;
    DECLARE v_oferta_existe INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    -- Iniciar transacción
    SET autocommit = 0;
    START TRANSACTION;
    
    -- Verificar si la oferta existe
    SELECT COUNT(*) INTO v_oferta_existe FROM ofertas WHERE id_ofe = p_id_oferta;
    IF v_oferta_existe = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La oferta no existe';
    END IF;
    
    -- Validar que al menos haya productos o categorías
    IF (p_productos_json IS NULL OR JSON_LENGTH(p_productos_json) = 0) AND 
       (p_categorias_json IS NULL OR JSON_LENGTH(p_categorias_json) = 0) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Debe proporcionar al menos un producto o una categoría';
    END IF;
    
    -- Actualizar los datos principales de la oferta
    UPDATE e_commerce.ofertas 
    SET 
        nom_ofe = p_nombre_oferta,
        des_ofe = p_descripcion,
        dur_ofe = p_duracion_horas,
        fec_ini_ofe = p_fecha_inicio,
        fec_fin_ofe = p_fecha_fin,
        por_des_ofe = p_porcentaje_descuento
    WHERE id_ofe = p_id_oferta;
    
    -- Eliminar relaciones existentes de productos y categorías
    DELETE FROM e_commerce.oferta_productos WHERE ofe_pro = p_id_oferta;
    DELETE FROM e_commerce.oferta_categoria_productos WHERE ofe_pro = p_id_oferta;
    
    -- Procesar productos si se proporcionan
    IF p_productos_json IS NOT NULL AND JSON_LENGTH(p_productos_json) > 0 THEN
        SET v_producto_count = JSON_LENGTH(p_productos_json);
        
        WHILE v_i < v_producto_count DO
            SET v_producto_id = JSON_EXTRACT(p_productos_json, CONCAT('$[', v_i, ']'));
            
            -- Verificar si el producto existe y está disponible
            SELECT COUNT(*) INTO v_producto_valido FROM productos 
            WHERE id_pro = v_producto_id AND sta_pro = 'DISPONIBLE';
            
            IF v_producto_valido THEN
                -- Insertar nueva relación oferta-producto
                INSERT INTO e_commerce.oferta_productos (ofe_pro, pro_ofe_pro)
                VALUES (p_id_oferta, v_producto_id);
            END IF;
            
            SET v_i = v_i + 1;
        END WHILE;
    END IF;
    
    -- Procesar categorías si se proporcionan
    IF p_categorias_json IS NOT NULL AND JSON_LENGTH(p_categorias_json) > 0 THEN
        SET v_i = 0;
        SET v_categoria_count = JSON_LENGTH(p_categorias_json);
        
        WHILE v_i < v_categoria_count DO
            SET v_categoria_id = JSON_EXTRACT(p_categorias_json, CONCAT('$[', v_i, ']'));
            
            -- Verificar si la categoría existe y está activa
            SELECT COUNT(*) INTO v_categoria_valida FROM cat_productos 
            WHERE id_cat_pro = v_categoria_id AND sta_cat_pro = 1;
            
            IF v_categoria_valida THEN
                -- Insertar nueva relación oferta-categoría
                INSERT INTO e_commerce.oferta_categoria_productos (ofe_pro, cat_ofe_pro)
                VALUES (p_id_oferta, v_categoria_id);
            END IF;
            
            SET v_i = v_i + 1;
        END WHILE;
    END IF;
    
    COMMIT;

    SET autocommit = 1;
END //


/* DROP PROCEDURE IF EXISTS e_commerce.GetAllOffers; */
/* DROP PROCEDURE IF EXISTS e_commerce.`GetOfferProduct`; */
/* DROP PROCEDURE IF EXISTS e_commerce.`RegisterOffer`; */
/* DROP PROCEDURE IF EXISTS e_commerce.`ModifyOffer`; */

/* CALL e_commerce.GetAllOffers(); */
/* CALL e_commerce.`GetOfferProduct`; */