-- Active: 1746130779175@@127.0.0.1@3306@e_commerce
CREATE PROCEDURE e_commerce.GetAllOffers()
BEGIN
    IF NOT EXISTS (SELECT * FROM e_commerce.ofertas LIMIT 1) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No hay ofertas disponibles';
    END IF;

    SELECT
        of.id_ofe,
        of.nom_ofe,
        of.des_ofe,
        of.dur_ofe,
        of.fec_ini_ofe,
        of.fec_fin_ofe,
        of.por_des_ofe,
        of.sta_ofe,
        of.available,
        of.created_at,
        of.updated_at,
        (
            SELECT GROUP_CONCAT(
                CONCAT_WS(';',
                    cp.id_cat_pro,
                    cp.nom_cat_pro,
                    cp.slug,
                    cp.des_cat_pro,
                    cp.sta_cat_pro,
                    cp.created_at,
                    cp.updated_at
                )
                SEPARATOR '---'
            ) FROM 
                cat_productos cp
            JOIN
                e_commerce.oferta_categoria_productos oc ON oc.ofe_pro = of.id_ofe
            WHERE 
                cp.id_cat_pro = oc.cat_ofe_pro
        ) AS Categories,
        (
            SELECT GROUP_CONCAT(
                CONCAT_WS(';',
                    p.id_pro,
                    p.nom_pro,
                    p.des_pro,
                    p.pre_pro,
                    p.sta_pro,
                    p.created_at,
                    p.updated_at
                )
                SEPARATOR '---'
            )FROM
                productos p
            JOIN
                e_commerce.oferta_productos op ON op.ofe_pro = of.id_ofe
            WHERE 
                p.id_pro = op.pro_ofe_pro
        ) AS Products
    FROM 
        e_commerce.ofertas of
    WHERE
        of.available = 1
    LIMIT 1000;
END //

CREATE PROCEDURE e_commerce.ChangeStateOffer(
    IN p_by VARCHAR(100)
)
BEGIN
    DECLARE v_id_ofe INT;
    DECLARE v_sta_ofe ENUM('PENDIENTE', 'ACTIVA', 'FINALIZADA');
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;

    START TRANSACTION;

    SELECT id_ofe, sta_ofe INTO v_id_ofe, v_sta_ofe
    FROM e_commerce.ofertas
    WHERE id_ofe = p_by;

    IF v_id_ofe IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Oferta no encontrada';
    END IF;

    IF v_sta_ofe = 'PENDIENTE' THEN
        UPDATE e_commerce.ofertas SET sta_ofe = 'ACTIVA' WHERE id_ofe = v_id_ofe;
    ELSEIF v_sta_ofe = 'ACTIVA' THEN
        UPDATE e_commerce.ofertas SET sta_ofe = 'FINALIZADA' WHERE id_ofe = v_id_ofe;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Estado de oferta no válido';
    END IF;

    COMMIT;

    SET autocommit = 0;
END //

CREATE PROCEDURE e_commerce.DeactivateOffer(
    IN p_by VARCHAR(100)
)
BEGIN
    DECLARE v_id_ofe INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;

    START TRANSACTION;

    SELECT id_ofe INTO v_id_ofe
    FROM e_commerce.ofertas
    WHERE id_ofe = p_by;

    IF v_id_ofe IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Oferta no encontrada';
    END IF;

    UPDATE e_commerce.ofertas SET available = 0 WHERE id_ofe = v_id_ofe;

    COMMIT;

    SET autocommit = 1;
END //

/* DROP PROCEDURE IF EXISTS e_commerce.GetAllOffers; */
/* CALL e_commerce.GetAllOffers(); */