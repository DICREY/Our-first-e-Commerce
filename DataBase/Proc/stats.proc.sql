-- Ventas totales por período
SELECT 
    DATE(fecha_ped) AS fecha,
    SUM(total) AS ventas_totales,
    COUNT(*) AS cantidad_pedidos
FROM e_commerce.pedidos
WHERE fecha_ped BETWEEN '2023-01-01' AND '2023-12-31'
GROUP BY DATE(fecha_ped)
ORDER BY fecha;

-- Productos más vendidos
SELECT 
    p.nom_pro AS producto,
    c.nom_cat_pro AS categoria,
    SUM(dp.cantidad) AS unidades_vendidas,
    SUM(dp.subtotal) AS ingresos_generados
FROM detalle_pedidos dp
JOIN productos p ON dp.id_producto = p.id_pro
JOIN cat_productos c ON p.cat_pro = c.id_cat_pro
GROUP BY p.id_pro
ORDER BY unidades_vendidas DESC
LIMIT 10;

-- Clientes más valiosos
SELECT 
    CONCAT(pe.nom_per, ' ', pe.ape_per) AS cliente,
    COUNT(p.id_ped) AS total_pedidos,
    SUM(p.total) AS gasto_total,
    AVG(p.total) AS ticket_promedio
FROM pedidos p
JOIN personas pe ON p.id_cliente = pe.id_per
GROUP BY p.id_cliente
ORDER BY gasto_total DESC
LIMIT 10;

-- Frecuencia de compra por cliente
SELECT 
    CONCAT(pe.nom_per, ' ', pe.ape_per) AS cliente,
    COUNT(p.id_ped) AS total_pedidos,
    DATEDIFF(MAX(p.fecha_ped), MIN(p.fecha_ped)) / COUNT(p.id_ped) AS dias_entre_compras
FROM pedidos p
JOIN personas pe ON p.id_cliente = pe.id_per
GROUP BY p.id_cliente
HAVING COUNT(p.id_ped) > 1;

-- Rendimiento por categoría
SELECT 
    c.nom_cat_pro AS categoria,
    COUNT(dp.id_detalle) AS items_vendidos,
    SUM(dp.subtotal) AS ingresos,
    SUM(dp.cantidad) AS unidades_vendidas
FROM detalle_pedidos dp
JOIN productos p ON dp.id_producto = p.id_pro
JOIN cat_productos c ON p.cat_pro = c.id_cat_pro
GROUP BY c.id_cat_pro
ORDER BY ingresos DESC;

-- Productos con bajo stock (asumiendo que agregamos columna stock)
SELECT 
    nom_pro AS producto,
    pre_pro AS precio,
    stock_actual
FROM productos
WHERE stock_actual < stock_minimo;

-- Ventas por mes
SELECT 
    YEAR(fecha_ped) AS año,
    MONTH(fecha_ped) AS mes,
    SUM(total) AS ventas_totales,
    COUNT(*) AS cantidad_pedidos
FROM pedidos
GROUP BY YEAR(fecha_ped), MONTH(fecha_ped)
ORDER BY año, mes;

-- Comparación interanual
SELECT 
    MONTH(fecha_ped) AS mes,
    SUM(CASE WHEN YEAR(fecha_ped) = 2022 THEN total ELSE 0 END) AS ventas_2022,
    SUM(CASE WHEN YEAR(fecha_ped) = 2023 THEN total ELSE 0 END) AS ventas_2023,
    (SUM(CASE WHEN YEAR(fecha_ped) = 2023 THEN total ELSE 0 END) - 
     SUM(CASE WHEN YEAR(fecha_ped) = 2022 THEN total ELSE 0 END)) / 
    SUM(CASE WHEN YEAR(fecha_ped) = 2022 THEN total ELSE 0 END) * 100 AS crecimiento_porcentual
FROM pedidos
WHERE YEAR(fecha_ped) IN (2022, 2023)
GROUP BY MONTH(fecha_ped)
ORDER BY mes;