-- Active: 1768620430430@@127.0.0.1@3306@e_commerce
-- Procedure to register a single inventory entry
CREATE PROCEDURE e_commerce.RegisterInventoryEntry(
    IN p_id_pro INT,
    IN p_nom_col VARCHAR(100),
    IN p_nom_tal VARCHAR(100),
    IN p_cantidad INT,
    IN p_costo DECIMAL(10, 2),
    IN p_fecha_ingreso DATE,
    IN p_hora_ingreso TIME,
    IN p_notas TEXT
)
BEGIN
    DECLARE v_id_col INT;
    DECLARE v_id_tal INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;

    START TRANSACTION;

    -- Get color ID
    SELECT id_col INTO v_id_col
    FROM e_commerce.colores
    WHERE nom_col = p_nom_col;

    IF v_id_col IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Color no encontrado';
    END IF;

    -- Get size ID
    SELECT id_tal_pro INTO v_id_tal
    FROM e_commerce.tallas
    WHERE nom_tal_pro = p_nom_tal;

    IF v_id_tal IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Talla no encontrada';
    END IF;

    -- Insert into entradas_inventario table
    INSERT INTO e_commerce.entradas_inventario (
        id_pro_ent,
        can_ent,
        id_col_ent,
        id_tal_ent,
        cos_uni_ent,
        fec_ing_ent,
        hor_ing_ent,
        not_ent,
        estado_ent
    ) VALUES (
        p_id_pro,
        p_cantidad,
        v_id_col,
        v_id_tal,
        p_costo,
        p_fecha_ingreso,
        p_hora_ingreso,
        p_notas,
        1
    );

    -- Update product inventory if needed
    UPDATE e_commerce.inventario 
    SET cantidad = cantidad + p_cantidad
    WHERE id_pro_inv = p_id_pro 
    AND id_col_inv = v_id_col
    AND id_tal_inv = v_id_tal;
    
    -- If no row was updated, insert a new one
    IF ROW_COUNT() = 0 THEN
        INSERT INTO e_commerce.inventario (
            id_pro_inv,
            id_col_inv,
            id_tal_inv,
            cantidad,
            cantidad_reservada
        ) VALUES (
            p_id_pro,
            v_id_col,
            v_id_tal,
            p_cantidad,
            0
        );
    END IF;

    COMMIT;

    SET autocommit = 1;
END //

CREATE PROCEDURE e_commerce.GetAllInventory()
BEGIN
    SELECT 
        i.id_inv,
        p.id_pro,
        p.nom_pro,
        p.pre_pro,
        c.nom_col,
        c.hex_col,
        t.nom_tal_pro,
        i.cantidad,
        i.cantidad_reservada,
        i.created_at,
        i.updated_at
    FROM e_commerce.inventario i
    JOIN e_commerce.productos p ON i.id_pro_inv = p.id_pro
    JOIN e_commerce.colores c ON i.id_col_inv = c.id_col
    JOIN e_commerce.tallas t ON i.id_tal_inv = t.id_tal_pro;
END;

CREATE PROCEDURE e_commerce.GetAllInventoryEntries()
BEGIN
    SELECT 
        ie.id_ent,
        ie.id_pro_ent,
        p.nom_pro,
        ie.can_ent,
        c.nom_col,
        t.nom_tal_pro,
        ie.cos_uni_ent,
        (ie.can_ent * ie.cos_uni_ent) as costo_total,
        ie.fec_ing_ent,
        ie.hor_ing_ent,
        ie.not_ent,
        ie.estado_ent,
        ie.created_at
    FROM e_commerce.entradas_inventario ie
    INNER JOIN e_commerce.productos p ON ie.id_pro_ent = p.id_pro
    INNER JOIN e_commerce.colores c ON ie.id_col_ent = c.id_col
    INNER JOIN e_commerce.tallas t ON ie.id_tal_ent = t.id_tal_pro
    ORDER BY ie.fec_ing_ent DESC, ie.hor_ing_ent DESC;
END //

CREATE PROCEDURE e_commerce.GetInventoryEntriesByProduct(
    IN p_id_pro INT
)
BEGIN
    SELECT 
        ie.id_ent,
        ie.id_pro_ent,
        p.nom_pro,
        ie.can_ent,
        c.nom_col,
        t.nom_tal_pro,
        ie.cos_uni_ent,
        (ie.can_ent * ie.cos_uni_ent) as costo_total,
        ie.fec_ing_ent,
        ie.hor_ing_ent,
        ie.not_ent,
        ie.estado_ent,
        ie.created_at
    FROM e_commerce.entradas_inventario ie
    INNER JOIN e_commerce.productos p ON ie.id_pro_ent = p.id_pro
    INNER JOIN e_commerce.colores c ON ie.id_col_ent = c.id_col
    INNER JOIN e_commerce.tallas t ON ie.id_tal_ent = t.id_tal_pro
    WHERE ie.id_pro_ent = p_id_pro
    ORDER BY ie.fec_ing_ent DESC, ie.hor_ing_ent DESC;
END //

CREATE PROCEDURE e_commerce.GetInventoryEntriesByDateRange(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        ie.id_ent,
        ie.id_pro_ent,
        p.nom_pro,
        ie.can_ent,
        c.nom_col,
        t.nom_tal_pro,
        ie.cos_uni_ent,
        (ie.can_ent * ie.cos_uni_ent) as costo_total,
        ie.fec_ing_ent,
        ie.hor_ing_ent,
        ie.not_ent,
        ie.estado_ent,
        ie.created_at
    FROM e_commerce.entradas_inventario ie
    INNER JOIN e_commerce.productos p ON ie.id_pro_ent = p.id_pro
    INNER JOIN e_commerce.colores c ON ie.id_col_ent = c.id_col
    INNER JOIN e_commerce.tallas t ON ie.id_tal_ent = t.id_tal_pro
    WHERE ie.fec_ing_ent BETWEEN p_start_date AND p_end_date
    ORDER BY ie.fec_ing_ent DESC, ie.hor_ing_ent DESC;
END //

CREATE PROCEDURE e_commerce.DeleteInventoryEntry(
    IN p_id_ent INT
)
BEGIN
    DECLARE v_id_pro INT;
    DECLARE v_cantidad INT;
    DECLARE v_id_col INT;
    DECLARE v_id_tal INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;

    START TRANSACTION;

    -- Get entry details before deleting
    SELECT id_pro_ent, can_ent, id_col_ent, id_tal_ent 
    INTO v_id_pro, v_cantidad, v_id_col, v_id_tal
    FROM e_commerce.entradas_inventario 
    WHERE id_ent = p_id_ent;

    IF v_id_pro IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Entrada de inventario no encontrada';
    END IF;

    -- Delete the entry
    /* DELETE FROM e_commerce.entradas_inventario 
    WHERE id_ent = p_id_ent; */

    -- Update product inventory
    UPDATE e_commerce.inventario 
    SET cantidad = cantidad - v_cantidad
    WHERE id_pro_inv = v_id_pro 
    AND id_col_inv = v_id_col 
    AND id_tal_inv = v_id_tal;

    COMMIT;

    SET autocommit = 1;
END //
/* Execute Procedures */
/* CALL e_commerce.RegisterInventoryEntry(1, 1, 1, 50, 20.00, '2026-02-15', '10:30:00', 'Ingreso inicial de inventario'); */
/* CALL e_commerce.GetAllInventoryEntries(); */
/* CALL e_commerce.GetInventoryEntriesByProduct(1); */
/* CALL e_commerce.GetInventoryEntriesByDateRange('2026-01-01', '2026-01-31'); */
/* CALL e_commerce.DeleteInventoryEntry(1); */

/* Delete Procedures  */
/* DROP PROCEDURE IF EXISTS e_commerce.RegisterInventoryEntry; */
/* DROP PROCEDURE IF EXISTS e_commerce.GetAllInventory; */
/* DROP PROCEDURE IF EXISTS e_commerce.GetAllInventoryEntries; */
/* DROP PROCEDURE IF EXISTS e_commerce.GetInventoryEntriesByProduct; */
/* DROP PROCEDURE IF EXISTS e_commerce.GetInventoryEntriesByDateRange; */
/* DROP PROCEDURE IF EXISTS e_commerce.DeleteInventoryEntry; */