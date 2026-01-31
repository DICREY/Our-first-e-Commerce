-- Active: 1768620430430@@127.0.0.1@3306@e_commerce
CREATE OR REPLACE VIEW e_commerce.inventory_summary AS
SELECT 
    ie.id_ent,
    ie.id_pro_ent,
    p.nom_pro,
    ie.can_ent,
    ie.id_col_ent,
    ie.id_tal_ent,
    ie.cos_uni_ent,
    (ie.can_ent * ie.cos_uni_ent) as valor_total,
    ie.fec_ing_ent,
    ie.hor_ing_ent,
    ie.not_ent,
    ie.estado_ent,
    pi.cantidad,
    pi.cantidad_reservada,
    (pi.cantidad - pi.cantidad_reservada) as cantidad_neta,
    ie.created_at
FROM entradas_inventario ie
INNER JOIN productos p ON ie.id_pro_ent = p.id_pro
LEFT JOIN inventario pi ON ie.id_pro_ent = pi.id_pro_inv
    AND ie.id_col_ent = pi.id_col_inv 
    AND ie.id_tal_ent = pi.id_tal_inv
ORDER BY ie.fec_ing_ent DESC;