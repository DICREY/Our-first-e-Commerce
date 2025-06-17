-- Active: 1746130779175@@127.0.0.1@3306@e_commerce
-- Ventas totales por período
CREATE PROCEDURE e_commerce.AnnualSales()
BEGIN
    SELECT 
        DATE(p.fec_ped) AS fecha,
        /* SUM(total) AS ventas_totales, --verify */
        COUNT(p.id_ped) AS cantidad_pedidos
    FROM 
        e_commerce.pedidos p
    WHERE 
        p.fec_ped BETWEEN '2025-01-01' AND '2025-12-31'
    GROUP BY 
        DATE(p.fec_ped)
    ORDER BY 
        fecha;
END //

-- Productos más vendidos
CREATE PROCEDURE e_commerce.SellestProducts()
BEGIN
    SELECT 
        p.nom_pro,
        p.pre_pro,
        p.sta_pro,
        p.des_pro,
        p.img_pro,
        c.nom_cat_pro AS cat_pro,
        (
            SELECT GROUP_CONCAT(
                CONCAT_WS(';',
                    co.nom_col,
                    co.hex_col
                ) 
                SEPARATOR '---'
            )
            FROM 
                productos_colores pco
            JOIN
                colores co ON pco.col_pro_col = co.id_col
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
        ) AS sizes,
        SUM(dp.can_det_ped) AS unidades_vendidas,
        SUM(dp.subtotal) AS ingresos_generados
    FROM
        detalle_pedidos dp
    JOIN 
        productos p ON dp.id_det_ped = p.id_pro
    JOIN
        cat_productos c ON p.cat_pro = c.id_cat_pro
    GROUP BY
        p.id_pro
    ORDER BY
        unidades_vendidas DESC
    LIMIT 10;
END //
-- Mayores compradores
CREATE PROCEDURE e_commerce.MajorBuyers()
BEGIN
    SELECT 
        CONCAT(pe.nom_per, ' ', pe.ape_per) AS cliente,
        COUNT(p.id_ped) AS total_pedidos
        /* SUM(p.total) AS gasto_total, */
        /* AVG(p.total) AS ticket_promedio */
    FROM
        pedidos p
    JOIN
        personas pe ON p.cli_ped = pe.id_per
    GROUP BY
        p.cli_ped
    ORDER BY
        gasto_total DESC
    LIMIT 10;
END //

-- Frecuencia de compra por cliente
CREATE PROCEDURE e_commerce.FrequencyPerClient()
BEGIN
    SELECT
        CONCAT(pe.nom_per, ' ', pe.ape_per) AS cliente,
        COUNT(p.id_ped) AS total_pedidos,
        DATEDIFF(MAX(p.fec_ped), MIN(p.fec_ped)) / COUNT(p.id_ped) AS dias_entre_compras
    FROM 
        pedidos p
    JOIN 
        personas pe ON p.cli_ped = pe.id_per
    GROUP BY
        p.cli_ped
    HAVING
        COUNT(p.id_ped) > 1;
END //

-- Rendimiento por categoría
CREATE PROCEDURE e_commerce.PerformancePerCategorie()
BEGIN
    SELECT 
        c.nom_cat_pro AS categoria,
        COUNT(dp.id_det_ped) AS items_vendidos,
        SUM(dp.subtotal) AS ingresos,
        SUM(dp.can_det_ped) AS unidades_vendidas
    FROM 
        detalle_pedidos dp
    JOIN
        productos p ON dp.id_det_ped = p.id_pro
    JOIN
        cat_productos c ON p.cat_pro = c.id_cat_pro
    GROUP BY
        c.id_cat_pro
    ORDER BY 
        ingresos DESC;
END //

-- Productos con bajo stock (asumiendo que agregamos columna stock)
CREATE PROCEDURE e_commerce.ProductsWithLowStock()
BEGIN
    SELECT 
        nom_pro AS producto,
        pre_pro AS precio,
        stock_actual
    FROM 
        productos
    WHERE
        stock_actual < stock_minimo;
END //
-- Ventas por mes
CREATE PROCEDURE e_commerce.SalesPerMonth()
BEGIN
    SELECT
        YEAR(fec_ped) AS año,
        MONTH(fec_ped) AS mes,
        /* SUM(total) AS ventas_totales, */
        COUNT(*) AS cantidad_pedidos
    FROM
        pedidos
    GROUP BY
        YEAR(fec_ped), MONTH(fec_ped)
    ORDER BY
        año, mes;
END //

-- Comparación interanual
CREATE PROCEDURE e_commerce.YearOnYearComparison()
BEGIN
    SELECT 
        MONTH(fec_ped) AS mes,
        SUM(CASE WHEN YEAR(fec_ped) = 2022 THEN total ELSE 0 END) AS ventas_2022,
        SUM(CASE WHEN YEAR(fec_ped) = 2023 THEN total ELSE 0 END) AS ventas_2023,
        (SUM(CASE WHEN YEAR(fec_ped) = 2023 THEN total ELSE 0 END) - 
        SUM(CASE WHEN YEAR(fec_ped) = 2022 THEN total ELSE 0 END)) / 
        SUM(CASE WHEN YEAR(fec_ped) = 2022 THEN total ELSE 0 END) * 100 AS crecimiento_porcentual
    FROM
        pedidos
    WHERE
        YEAR(fec_ped) IN (2022, 2023)
    GROUP BY
        MONTH(fec_ped)
    ORDER BY
        mes;
END //

/* CALL SellestProducts(); */
/* DROP PROCEDURE `SellestProducts`; */