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
            (
                SELECT GROUP_CONCAT(
                    CONCAT_WS(';',
                        pr.id_pro,
                        pr.nom_pro,
                        pr.pre_pro,
                        pr.des_pro,
                        pr.sta_pro,
                        pr.onSale,
                        img.url_img,
                        col.nom_col,
                        col.hex_col,
                        t.nom_tal_pro
                    ) 
                    SEPARATOR '---'
                ) FROM productos pr
                JOIN e_commerce.productos_pedidos pp ON pp.id_det_ped = dp.id_det_ped
                JOIN e_commerce.colores col ON pp.col_pro_ped = col.id_col
                JOIN e_commerce.imagenes img ON pp.img_pro_ped = img.id_img
                JOIN e_commerce.tallas t ON pp.tal_pro_ped = t.id_tal_pro 
                WHERE
                    pp.pro_ped = pr.id_pro
            ) AS products,
            SUM(dp.can_det_ped) AS cantidad,
            SUM(dp.subtotal) AS total_pedido 
        FROM 
            e_commerce.pedidos p
        INNER JOIN e_commerce.personas per ON p.cli_ped = per.id_per
        INNER JOIN e_commerce.metodos_pagos mp ON p.met_pag_ped = mp.id_met_pag
        INNER JOIN e_commerce.detalle_pedidos dp ON dp.ped_det_ped = p.id_ped
        GROUP BY p.id_ped
        ORDER BY p.fec_ped DESC, p.id_ped DESC;
    END IF;
END //

/* DROP PROCEDURE e_commerce.GetAllOrders; */

/* CALL e_commerce.GetAllOrders(); */