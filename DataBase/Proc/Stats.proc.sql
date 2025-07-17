-- Active: 1747352860830@@127.0.0.1@3306@e_commerce
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
CREATE PROCEDURE e_commerce.MonthlySales()
BEGIN
    -- Tabla de meses (1=Enero, ..., 12=Diciembre)
    WITH meses AS (
        SELECT 1 AS mes_num, 'Ene' AS nombre_mes UNION ALL
        SELECT 2, 'Feb' UNION ALL
        SELECT 3, 'Mar' UNION ALL
        SELECT 4, 'Abr' UNION ALL
        SELECT 5, 'May' UNION ALL
        SELECT 6, 'Jun' UNION ALL
        SELECT 7, 'Jul' UNION ALL
        SELECT 8, 'Ago' UNION ALL
        SELECT 9, 'Sep' UNION ALL
        SELECT 10, 'Oct' UNION ALL
        SELECT 11, 'Nov' UNION ALL
        SELECT 12, 'Dic'
    ),
    ventas AS (
        SELECT 
            YEAR(p.fec_ped) AS anio,
            MONTH(p.fec_ped) AS mes_num,
            COUNT(DISTINCT p.id_ped) AS cantidad_pedidos,
            IFNULL(SUM(dp.subtotal), 0) AS total_vendido
        FROM 
            e_commerce.pedidos p
        LEFT JOIN
            e_commerce.detalle_pedidos dp ON dp.ped_det_ped = p.id_ped
        WHERE 
            p.fec_ped BETWEEN '2025-01-01' AND '2025-12-31'
        GROUP BY 
            anio, mes_num
    )
    SELECT 
        v.anio,
        m.mes_num,
        m.nombre_mes,
        IFNULL(v.cantidad_pedidos, 0) AS cantidad_pedidos,
        IFNULL(v.total_vendido, 0) AS total_vendido
    FROM 
        (SELECT DISTINCT anio FROM ventas) anios
    CROSS JOIN meses m
    LEFT JOIN ventas v
        ON v.anio = anios.anio AND v.mes_num = m.mes_num
    ORDER BY 
        anios.anio, m.mes_num;
END //

CREATE PROCEDURE e_commerce.WeeklySales()
BEGIN
    -- Tabla de días de la semana (1=Domingo, 2=Lunes, ..., 7=Sábado)
    WITH dias AS (
        SELECT 1 AS dia_num, 'Dom' AS nombre_dia UNION ALL
        SELECT 2, 'Lun' UNION ALL
        SELECT 3, 'Mar' UNION ALL
        SELECT 4, 'Mié' UNION ALL
        SELECT 5, 'Jue' UNION ALL
        SELECT 6, 'Vie' UNION ALL
        SELECT 7, 'Sáb'
    ),
    ventas AS (
        SELECT 
            YEAR(p.fec_ped) AS anio,
            WEEK(p.fec_ped, 1) AS semana,
            DAYOFWEEK(p.fec_ped) AS dia_num,
            COUNT(DISTINCT p.id_ped) AS cantidad_pedidos,
            IFNULL(SUM(dp.subtotal), 0) AS total_vendido
        FROM 
            e_commerce.pedidos p
        LEFT JOIN
            e_commerce.detalle_pedidos dp ON dp.ped_det_ped = p.id_ped
        WHERE 
            YEAR(p.fec_ped) = YEAR(CURRENT_DATE)
            AND WEEK(p.fec_ped, 1) = WEEK(CURRENT_DATE, 1)
        GROUP BY 
            anio, semana, dia_num
    )
    SELECT 
        semanas.anio,
        semanas.semana,
        d.dia_num,
        d.nombre_dia,
        IFNULL(v.cantidad_pedidos, 0) AS cantidad_pedidos,
        IFNULL(v.total_vendido, 0) AS total_vendido
    FROM 
        (SELECT DISTINCT anio, semana FROM ventas) semanas
    CROSS JOIN dias d
    LEFT JOIN ventas v
        ON v.anio = semanas.anio AND v.semana = semanas.semana AND v.dia_num = d.dia_num
    ORDER BY 
        semanas.anio, semanas.semana, d.dia_num;
END //

CREATE PROCEDURE e_commerce.SalesPerDay()
BEGIN
    -- Ventas diarias para el gráfico (últimos 12 días)
    SELECT 
        DATE_FORMAT(p.fec_ped, '%b %e') AS day,
        SUM(d.subtotal) AS value
    FROM e_commerce.pedidos p
    JOIN e_commerce.detalle_pedidos d ON p.id_ped = d.ped_det_ped
    WHERE p.sta_ped != 'CANCELADO'
      AND p.fec_ped >= CURRENT_DATE - INTERVAL 12 DAY
    GROUP BY DATE(p.fec_ped)
    ORDER BY tipo, day;
END //

CREATE PROCEDURE e_commerce.TodaySales()
BEGIN
    -- Ventas diarias para el gráfico (últimos 12 días)
    SELECT 
        DATE_FORMAT(p.fec_ped, '%b %e') AS day,
        SUM(d.subtotal) AS value
    FROM e_commerce.pedidos p
    JOIN e_commerce.detalle_pedidos d ON p.id_ped = d.ped_det_ped
    WHERE p.sta_ped != 'CANCELADO'
      AND p.fec_ped = CURRENT_DATE
    GROUP BY DATE(p.fec_ped)
    ORDER BY day;
END //

-- Productos más vendidos
CREATE PROCEDURE e_commerce.SellestProducts()
BEGIN
    SELECT 
        p.id_pro,
        p.nom_pro,
        p.pre_pro,
        p.sta_pro,
        p.des_pro,
        c.nom_cat_pro AS cat_pro,
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
        SUM(dp.can_det_ped) AS unidades_vendidas,
        SUM(dp.subtotal) AS ingresos_generados
    FROM
        detalle_pedidos dp
    JOIN 
        productos p ON dp.pro_det_ped = p.id_pro
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

CREATE PROCEDURE e_commerce.StatsTotalSales()
BEGIN
    -- Ventas del mes anterior
    SELECT 
        'last_month_sales' AS tipo,
        NULL AS day,
        NULL AS prev_year_sales,
        SUM(d.subtotal) AS value
    FROM e_commerce.pedidos p
    JOIN e_commerce.detalle_pedidos d ON p.id_ped = d.ped_det_ped
    WHERE p.sta_ped != 'CANCELADO'
      AND YEAR(p.fec_ped) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
      AND MONTH(p.fec_ped) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
    
    UNION ALL

    -- Ventas del año anterior (mismo mes)
    SELECT 
        'prev_year_sales' AS tipo,
        NULL AS day,
        SUM(d.subtotal) AS value,
        NULL AS last_month_sales
    FROM e_commerce.pedidos p
    JOIN e_commerce.detalle_pedidos d ON p.id_ped = d.ped_det_ped
    WHERE p.sta_ped != 'CANCELADO'
      AND YEAR(p.fec_ped) = YEAR(CURRENT_DATE) - 1
      AND MONTH(p.fec_ped) = MONTH(CURRENT_DATE);
END //

/* CALL SellestProducts(); */
/* CALL e_commerce.WeeklySales(); */
/* CALL e_commerce.MonthlySales(); */
/* CALL e_commerce.StatsTotalSales(); */
/* CALL e_commerce.SalesPerDay(); */
/* CALL e_commerce.TodaySales(); */

/* DROP PROCEDURE `SellestProducts`; */
/* DROP PROCEDURE e_commerce.`WeeklySales`; */
/* DROP PROCEDURE e_commerce.`MonthlySales`; */
/* DROP PROCEDURE e_commerce.`StatsTotalSales`; */
/* DROP PROCEDURE e_commerce.`SalesPerDay`; */
/* DROP PROCEDURE e_commerce.`TodaySales`; */