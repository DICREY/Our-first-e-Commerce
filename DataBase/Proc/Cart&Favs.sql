-- Active: 1768620430430@@127.0.0.1@3306@e_commerce
CREATE PROCEDURE e_commerce.AddToCart(
    IN p_user VARCHAR(100),
    IN p_id_inv INT,
    IN p_quantity INT
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_available_stock INT;
    DECLARE v_current_quantity INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;
    START TRANSACTION;

    -- Verificar usuario
    SELECT id_per INTO v_user_id FROM personas 
    WHERE doc_per = p_user OR email_per = p_user;
    IF v_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    -- Verificar inventario y stock
    SELECT cantidad INTO v_available_stock FROM inventario WHERE id_inv = p_id_inv;
    IF v_available_stock IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Inventario no encontrado';
    END IF;
    IF v_available_stock < p_quantity THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock insuficiente para la cantidad solicitada';
    END IF;

    -- Verificar si ya existe en el carrito
    SELECT cantidad INTO v_current_quantity 
    FROM carrito 
    WHERE id_per_car = v_user_id 
      AND id_inv_car = p_id_inv;

    IF v_current_quantity IS NULL THEN
        -- Nuevo item en carrito
        INSERT INTO carrito (id_per_car, id_inv_car, cantidad)
        VALUES (v_user_id, p_id_inv, p_quantity);
    ELSE
        -- Actualizar cantidad existente
        IF (v_current_quantity + p_quantity) > v_available_stock THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La cantidad total excede el stock disponible';
        END IF;
        UPDATE carrito 
        SET cantidad = cantidad + p_quantity, 
            updated_at = CURRENT_TIMESTAMP
        WHERE id_per_car = v_user_id 
          AND id_inv_car = p_id_inv;
    END IF;

    COMMIT;
    SET autocommit = 1;
END //

CREATE PROCEDURE e_commerce.UpdateCartQuantity(
    IN p_user VARCHAR(100),
    IN p_cart_id INT,
    IN p_new_quantity INT
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_inventory_id INT;
    DECLARE v_available_stock INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;
    START TRANSACTION;

    -- Obtener el ID del usuario basado en el documento
    SELECT id_per INTO v_user_id 
    FROM personas 
    WHERE doc_per = p_user OR email_per = p_user;
    
    IF v_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    -- Validar cantidad positiva
    IF p_new_quantity <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La cantidad debe ser mayor a cero';
    END IF;

    -- Obtener referencia al inventario
    SELECT id_inv_car INTO v_inventory_id 
    FROM carrito 
    WHERE id_car = p_cart_id 
      AND id_per_car = v_user_id;
    
    IF v_inventory_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ítem no encontrado en el carrito';
    END IF;

    -- Verificar stock disponible
    SELECT cantidad INTO v_available_stock
    FROM inventario
    WHERE id_inv = v_inventory_id;
    
    IF p_new_quantity > v_available_stock THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La cantidad solicitada excede el stock disponible';
    END IF;

    -- Actualizar cantidad
    UPDATE carrito
    SET cantidad = p_new_quantity,
        updated_at = CURRENT_TIMESTAMP
    WHERE id_car = p_cart_id
      AND id_per_car = v_user_id;

    COMMIT;
    SET autocommit = 1;
END //

CREATE PROCEDURE e_commerce.RemoveFromCart(
    IN p_user VARCHAR(100),
    IN p_cart_id INT
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_rows_affected INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;
    START TRANSACTION;

    -- Obtener el ID del usuario basado en el documento
    SELECT id_per INTO v_user_id 
    FROM personas 
    WHERE doc_per = p_user OR email_per = p_user;
    
    IF v_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    -- Eliminar ítem del carrito
    DELETE FROM carrito 
    WHERE id_car = p_cart_id 
      AND id_per_car = v_user_id;
    
    SET v_rows_affected = ROW_COUNT();
    
    IF v_rows_affected = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ítem no encontrado en el carrito';
    END IF;

    COMMIT;
    SET autocommit = 1;
END //

CREATE PROCEDURE e_commerce.AddToFavorites(
    IN p_user VARCHAR(100),
    IN p_product_id INT
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_product_status VARCHAR(20);
    DECLARE v_already_favorite INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;
    START TRANSACTION;

    -- Obtener el ID del usuario basado en el documento
    SELECT id_per INTO v_user_id 
    FROM personas 
    WHERE doc_per = p_user OR email_per = p_user;
    
    IF v_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    -- Verificar si el producto está disponible
    SELECT sta_pro INTO v_product_status 
    FROM productos 
    WHERE id_pro = p_product_id;
    
    IF v_product_status != 'DISPONIBLE' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El producto no está disponible para agregar a favoritos';
    END IF;

    -- Verificar si ya es favorito
    SELECT COUNT(*) INTO v_already_favorite
    FROM favoritos
    WHERE id_per_fav = v_user_id 
      AND id_pro_fav = p_product_id;
    
    IF v_already_favorite > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El producto ya está en tus favoritos';
    END IF;

    -- Agregar a favoritos
    INSERT INTO favoritos (id_per_fav, id_pro_fav)
    VALUES (v_user_id, p_product_id);

    SELECT 
        p.*,
        cp.id_cat_pro,
        cp.nom_cat_pro
    FROM
        productos p
    JOIN
        cat_productos cp ON p.cat_pro = cp.id_cat_pro
    WHERE
        p.id_pro = p_product_id;

    COMMIT;
    SET autocommit = 1;
END //

CREATE PROCEDURE e_commerce.RemoveFromFavorites(
    IN p_user VARCHAR(100),
    IN p_product_id INT
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_rows_affected INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;
    START TRANSACTION;

    -- Obtener el ID del usuario basado en el documento
    SELECT id_per INTO v_user_id 
    FROM personas 
    WHERE doc_per = p_user OR email_per = p_user;

    IF v_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    -- Eliminar de favoritos
    DELETE FROM favoritos 
    WHERE id_per_fav = v_user_id 
      AND id_pro_fav = p_product_id;
    
    SET v_rows_affected = ROW_COUNT();
    
    IF v_rows_affected = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El producto no estaba en tus favoritos';
    END IF;

    COMMIT;
    SET autocommit = 1;
END //

CREATE PROCEDURE e_commerce.GetUserCart(
    IN p_user VARCHAR(100)
)
BEGIN
    DECLARE v_user_id INT;
    
    -- Obtener el ID del usuario basado en el email
    SELECT id_per INTO v_user_id 
    FROM personas 
    WHERE email_per = p_user OR doc_per = p_user;

    IF v_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    SELECT 
        c.id_car,
        p.id_pro,
        p.nom_pro,
        p.pre_pro,
        p.des_pro,
        col.nom_col,
        col.hex_col,
        tal.nom_tal_pro,
        c.cantidad,
        (p.pre_pro * c.cantidad) AS subtotal,
        i.url_img AS imagen,
        inv.cantidad AS stock_disponible
    FROM 
        carrito c
    JOIN 
        inventario inv ON c.id_inv_car = inv.id_inv
    JOIN 
        productos p ON inv.id_pro_inv = p.id_pro
    JOIN 
        colores col ON inv.id_col_inv = col.id_col
    JOIN 
        tallas tal ON inv.id_tal_inv = tal.id_tal_pro
    LEFT JOIN
        productos_colores pc ON p.id_pro = pc.pro_col_pro AND col.id_col = pc.col_pro_col
    LEFT JOIN
        imagenes i ON pc.img_pro_col = i.id_img
    WHERE 
        c.id_per_car = v_user_id
    ORDER BY 
        c.created_at DESC;
END //

CREATE PROCEDURE e_commerce.GetUserFavorites(
    IN p_user VARCHAR(100)
)
BEGIN
    DECLARE v_user_id INT;
    
    -- Obtener el ID del usuario basado en el documento
    SELECT id_per INTO v_user_id 
    FROM personas 
    WHERE email_per = p_user OR doc_per = p_user;

    IF v_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    SELECT 
        f.id_fav,
        p.id_pro,
        p.nom_pro,
        p.pre_pro,
        p.des_pro,
        p.sta_pro,
        p.onSale,
        (
            SELECT i.url_img
            FROM productos_colores pc
            JOIN imagenes i ON pc.img_pro_col = i.id_img
            WHERE pc.pro_col_pro = p.id_pro
            LIMIT 1
        ) AS imagen_default,
        (
            SELECT GROUP_CONCAT(DISTINCT col.nom_col SEPARATOR ', ')
            FROM productos_colores pc
            JOIN colores col ON pc.col_pro_col = col.id_col
            WHERE pc.pro_col_pro = p.id_pro
        ) AS colores_disponibles,
        (
            SELECT GROUP_CONCAT(DISTINCT tal.nom_tal_pro SEPARATOR ', ')
            FROM inventario inv
            JOIN tallas tal ON inv.id_tal_inv = tal.id_tal_pro
            WHERE inv.id_pro_inv = p.id_pro
        ) AS tallas_disponibles,
        f.created_at AS fecha_agregado
    FROM 
        favoritos f
    JOIN 
        productos p ON f.id_pro_fav = p.id_pro
    WHERE 
        f.id_per_fav = v_user_id
    ORDER BY 
        f.created_at DESC;
END //

/* DROP PROCEDURE e_commerce.GetUserCart; */
/* DROP PROCEDURE e_commerce.AddToCart; */
/* DROP PROCEDURE e_commerce.UpdateCartQuantity; */
/* DROP PROCEDURE e_commerce.RemoveFromCart; */

/* DROP PROCEDURE e_commerce.GetUserFavorites; */
/* DROP PROCEDURE e_commerce.AddToFavorites; */
/* DROP PROCEDURE e_commerce.RemoveFromFavorites; */