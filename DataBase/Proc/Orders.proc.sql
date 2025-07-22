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
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontro pedidos en el sistema';
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

/* DROP PROCEDURE e_commerce.GetAllOrders; */
/* DROP PROCEDURE e_commerce.`GetOrderBy`; */

/* CALL e_commerce.GetAllOrders(); */
/* CALL e_commerce.GetOrderBy(123450989); */