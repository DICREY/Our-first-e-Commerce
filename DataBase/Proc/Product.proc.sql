-- Active: 1746130779175@@127.0.0.1@3306@e_commerce
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
    -- Verifica si hay categorias
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
    -- Verifica si hay categorias
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
    -- Verifica si hay productos
    IF NOT EXISTS (SELECT 1 FROM e_commerce.productos) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No existen productos registrados';
    END IF;

    SELECT 
        p.id_pro,
        p.nom_pro,
        p.pre_pro,
        p.des_pro,
        p.sta_pro,
        c.id_cat_pro,
        c.nom_cat_pro,
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
            SELECT GROUP_CONCAT(
                t.nom_tal_pro
                SEPARATOR '---'
            )
            FROM 
                productos_tallas pt
            JOIN
                tallas t ON pt.tal_pro_tal = t.id_tal_pro
            WHERE
                pt.pro_tal_pro = p.id_pro
        ) AS sizes
    FROM 
        e_commerce.productos p
    INNER JOIN 
        e_commerce.cat_productos c ON p.cat_pro = c.id_cat_pro
    LIMIT 1000;
END //
CREATE PROCEDURE e_commerce.GetProductsByCategory(
    IN p_nom_cat VARCHAR(100)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM cat_productos WHERE nom_cat_pro LIKE p_nom_cat) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La categoria no existe en el sistema';
    END IF;
    
    -- Verifica si existen productos en la categoría indicada por nombre
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
        c.nom_cat_pro,
        c.sta_cat_pro,
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
            SELECT GROUP_CONCAT(
                t.nom_tal_pro
                SEPARATOR '---'
            )
            FROM 
                productos_tallas pt
            JOIN
                tallas t ON pt.tal_pro_tal = t.id_tal_pro
            WHERE
                pt.pro_tal_pro = p.id_pro
        ) AS sizes
    FROM 
        e_commerce.productos p
    INNER JOIN 
        e_commerce.cat_productos c ON p.cat_pro = c.id_cat_pro
    WHERE 
        c.nom_cat_pro LIKE p_nom_cat
        AND c.sta_cat_pro = 1
    LIMIT 1000;
END //

/* DROP PROCEDURE e_commerce.GetAllProducts; */
/* DROP PROCEDURE e_commerce.GetProductsCategories; */
/* DROP PROCEDURE e_commerce.`GetProductsColors`; */
/* DROP PROCEDURE e_commerce.`GetProductsSizes`; */
/* DROP PROCEDURE e_commerce.GetProductsByCategory; */

/* CALL e_commerce.GetAllProducts(); */
/* CALL e_commerce.GetProductsCategories(); */
/* CALL e_commerce.GetProductsByCategory('Lencería'); */