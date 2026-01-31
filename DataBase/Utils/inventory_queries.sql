-- EJEMPLOS DE QUERIES ÚTILES PARA EL SISTEMA DE INVENTARIO

-- ============================================
-- 1. VER TODAS LAS ENTRADAS DE INVENTARIO
-- ============================================
SELECT * FROM inventory_entries 
ORDER BY fecha_ingreso DESC, hora_ingreso DESC;

-- ============================================
-- 2. VER ENTRADAS CON INFORMACIÓN DEL PRODUCTO
-- ============================================
SELECT 
    ie.id_entrada,
    ie.id_pro,
    p.nom_pro,
    ie.cantidad,
    ie.color,
    ie.talla,
    ie.costo_unitario,
    (ie.cantidad * ie.costo_unitario) as valor_total,
    ie.fecha_ingreso,
    ie.hora_ingreso,
    ie.notas,
    ie.estado
FROM inventory_entries ie
INNER JOIN products p ON ie.id_pro = p.id_pro
ORDER BY ie.fecha_ingreso DESC;

-- ============================================
-- 3. ENTRADAS DE HOY
-- ============================================
SELECT * FROM inventory_entries 
WHERE DATE(fecha_ingreso) = CURDATE()
ORDER BY hora_ingreso DESC;

-- ============================================
-- 4. TOTAL DE CANTIDAD INGRESADA POR PRODUCTO
-- ============================================
SELECT 
    p.id_pro,
    p.nom_pro,
    SUM(ie.cantidad) as total_ingresado,
    COUNT(*) as num_entradas,
    SUM(ie.cantidad * ie.costo_unitario) as valor_total
FROM inventory_entries ie
INNER JOIN products p ON ie.id_pro = p.id_pro
GROUP BY p.id_pro, p.nom_pro
ORDER BY total_ingresado DESC;

-- ============================================
-- 5. ENTRADAS POR COLOR Y TALLA
-- ============================================
SELECT 
    color,
    talla,
    SUM(cantidad) as total_ingresado,
    COUNT(*) as num_entradas,
    AVG(costo_unitario) as costo_promedio
FROM inventory_entries
WHERE estado = 'activo'
GROUP BY color, talla
ORDER BY total_ingresado DESC;

-- ============================================
-- 6. INVENTARIO DISPONIBLE POR PRODUCTO
-- ============================================
SELECT 
    pi.id_pro,
    p.nom_pro,
    pi.color,
    pi.talla,
    pi.cantidad_disponible,
    pi.cantidad_reservada,
    (pi.cantidad_disponible - pi.cantidad_reservada) as cantidad_neta,
    pi.fecha_actualizacion
FROM products_inventory pi
INNER JOIN products p ON pi.id_pro = p.id_pro
WHERE pi.cantidad_disponible > 0
ORDER BY pi.id_pro, pi.color, pi.talla;

-- ============================================
-- 7. ÚLTIMAS 10 ENTRADAS REGISTRADAS
-- ============================================
SELECT * FROM inventory_entries 
ORDER BY fecha_registro DESC 
LIMIT 10;

-- ============================================
-- 8. COSTO TOTAL DE INVENTARIO INGRESADO
-- ============================================
SELECT 
    DATE(fecha_ingreso) as fecha,
    COUNT(*) as num_entradas,
    SUM(cantidad) as total_cantidad,
    SUM(cantidad * costo_unitario) as costo_total
FROM inventory_entries
WHERE estado = 'activo'
GROUP BY DATE(fecha_ingreso)
ORDER BY fecha DESC;

-- ============================================
-- 9. ENTRADAS EN UN RANGO DE FECHAS
-- ============================================
SELECT * FROM inventory_entries 
WHERE DATE(fecha_ingreso) BETWEEN '2026-01-01' AND '2026-01-31'
ORDER BY fecha_ingreso DESC, hora_ingreso DESC;

-- ============================================
-- 10. PRODUCTOS SIN STOCK
-- ============================================
SELECT 
    p.id_pro,
    p.nom_pro,
    COUNT(pi.id_inventario) as variantes_registradas,
    COALESCE(SUM(pi.cantidad_disponible), 0) as cantidad_total
FROM products p
LEFT JOIN products_inventory pi ON p.id_pro = pi.id_pro
GROUP BY p.id_pro, p.nom_pro
HAVING cantidad_total = 0 OR cantidad_total IS NULL
ORDER BY p.nom_pro;

-- ============================================
-- 11. MOVIMIENTO DE INVENTARIO POR DÍA
-- ============================================
SELECT 
    DATE(fecha_ingreso) as fecha,
    DAYNAME(fecha_ingreso) as dia,
    COUNT(*) as entradas_registradas,
    SUM(cantidad) as items_ingresados,
    SUM(cantidad * costo_unitario) as valor_movimiento
FROM inventory_entries
WHERE estado = 'activo'
GROUP BY DATE(fecha_ingreso)
ORDER BY fecha DESC
LIMIT 30;

-- ============================================
-- 12. COSTO PROMEDIO POR PRODUCTO
-- ============================================
SELECT 
    p.id_pro,
    p.nom_pro,
    AVG(ie.costo_unitario) as costo_promedio,
    MIN(ie.costo_unitario) as costo_minimo,
    MAX(ie.costo_unitario) as costo_maximo,
    COUNT(*) as num_registros
FROM inventory_entries ie
INNER JOIN products p ON ie.id_pro = p.id_pro
WHERE ie.estado = 'activo'
GROUP BY p.id_pro, p.nom_pro
ORDER BY costo_promedio DESC;

-- ============================================
-- 13. PRODUCTOS CON MÁS VARIANTES REGISTRADAS
-- ============================================
SELECT 
    p.nom_pro,
    COUNT(DISTINCT pi.color) as colores,
    COUNT(DISTINCT pi.talla) as tallas,
    COUNT(DISTINCT CONCAT(pi.color, '-', pi.talla)) as variantes_totales,
    SUM(pi.cantidad_disponible) as cantidad_total
FROM products_inventory pi
INNER JOIN products p ON pi.id_pro = p.id_pro
GROUP BY pi.id_pro, p.nom_pro
ORDER BY variantes_totales DESC;

-- ============================================
-- 14. BÚSQUEDA POR NOTA (PROVEEDOR, LOTE, ETC)
-- ============================================
SELECT * FROM inventory_entries 
WHERE notas LIKE '%proveedor%'  -- Cambiar según necesidad
ORDER BY fecha_ingreso DESC;

-- ============================================
-- 15. AUDITORÍA - QUIÉN REGISTRÓ Y CUÁNDO
-- ============================================
SELECT 
    id_entrada,
    id_pro,
    cantidad,
    fecha_ingreso,
    hora_ingreso,
    fecha_registro,
    estado
FROM inventory_entries
WHERE DATE(fecha_registro) = CURDATE()
ORDER BY fecha_registro DESC;

-- ============================================
-- 16. RESTABLECER CANTIDADES (ÚTIL PARA FIXES)
-- ============================================
-- BACKUP ANTES DE HACER ESTO!
UPDATE products_inventory 
SET cantidad_disponible = 0
WHERE id_pro = ?;  -- Reemplazar con ID del producto

-- ============================================
-- 17. VER VISTA DE RESUMEN DE INVENTARIO
-- ============================================
SELECT * FROM inventory_summary
ORDER BY fecha_ingreso DESC
LIMIT 100;

-- ============================================
-- 18. VALIDAR INTEGRIDAD DE DATOS
-- ============================================
-- Verificar que todos los IDs de productos existan
SELECT DISTINCT ie.id_pro 
FROM inventory_entries ie
LEFT JOIN products p ON ie.id_pro = p.id_pro
WHERE p.id_pro IS NULL;

-- ============================================
-- 19. ENTRADAS DUPLICADAS (POTENCIAL)
-- ============================================
SELECT 
    id_pro,
    cantidad,
    color,
    talla,
    costo_unitario,
    fecha_ingreso,
    hora_ingreso,
    COUNT(*) as repeticiones
FROM inventory_entries
GROUP BY id_pro, cantidad, color, talla, costo_unitario, fecha_ingreso, hora_ingreso
HAVING repeticiones > 1
ORDER BY repeticiones DESC;

-- ============================================
-- 20. EXPORTACIÓN DE DATOS (PARA ANÁLISIS)
-- ============================================
SELECT 
    ie.id_entrada,
    ie.fecha_ingreso,
    ie.hora_ingreso,
    p.nom_pro,
    ie.cantidad,
    ie.color,
    ie.talla,
    ie.costo_unitario,
    (ie.cantidad * ie.costo_unitario) as valor_total,
    ie.notas
INTO OUTFILE '/tmp/inventory_export.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
FROM inventory_entries ie
INNER JOIN products p ON ie.id_pro = p.id_pro
WHERE ie.fecha_ingreso >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
ORDER BY ie.fecha_ingreso DESC;

-- ============================================
-- CONSULTAS ÚTILES ADICIONALES
-- ============================================

-- Ver procedimientos disponibles
SHOW PROCEDURES;

-- Ver procedimiento específico
SHOW CREATE PROCEDURE RegisterInventoryEntry;

-- Estadísticas de la tabla
SELECT 
    TABLE_NAME,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS Size_MB
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'nombre_base_datos'
AND TABLE_NAME IN ('inventory_entries', 'products_inventory');

-- Ver índices
SHOW INDEX FROM inventory_entries;
SHOW INDEX FROM products_inventory;

-- ============================================
-- MANTENIMIENTO
-- ============================================

-- Optimizar tablas
OPTIMIZE TABLE inventory_entries;
OPTIMIZE TABLE products_inventory;

-- Verificar integridad
CHECK TABLE inventory_entries;
CHECK TABLE products_inventory;

-- Reparar si hay problemas
REPAIR TABLE inventory_entries;
REPAIR TABLE products_inventory;

-- Ver estadísticas de la tabla
ANALYZE TABLE inventory_entries;
ANALYZE TABLE products_inventory;
