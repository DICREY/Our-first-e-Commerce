CREATE PROCEDURE e_commerce.RegistPeoples(
    IN p_nom_per VARCHAR(100),
    IN p_ape_per VARCHAR(100),
    IN p_fec_nac_per DATE,
    IN p_tip_doc_per VARCHAR(10),
    IN p_doc_per VARCHAR(20),
    IN p_dir_per VARCHAR(100),
    IN p_cel_per VARCHAR(20),
    IN p_cel2_per VARCHAR(20),
    IN p_email_per VARCHAR(100),
    IN p_cont_per VARCHAR(255),
    IN p_gen_per VARCHAR(20)
)
BEGIN
    DECLARE p_id_persona INT;
    DECLARE p_id_rol INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
     BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;

    START TRANSACTION;

    INSERT INTO personas (
        nom_per,ape_per,fec_nac_per,tip_doc_per,doc_per,dir_per,cel_per,cel2_per,email_per,cont_per,gen_per
    )
    VALUES (
        p_nom_per,p_ape_per,p_fec_nac_per,p_tip_doc_per,p_doc_per,p_dir_per,p_cel_per,p_cel2_per,p_email_per,p_cont_per,p_gen_per
    );

    SET p_id_persona = LAST_INSERT_ID();

    SELECT id_rol INTO p_id_rol FROM roles WHERE nom_rol = 'Usuario';

    INSERT INTO otorgar_roles(id_per,id_rol,fec_oto)
    VALUES (p_id_persona,p_id_rol,NOW());

    COMMIT;
    SET autocommit = 1;
END //
CREATE PROCEDURE e_commerce.ModifyPeople(
    IN p_nom_per VARCHAR(100),
    IN p_ape_per VARCHAR(100),
    IN p_fec_nac_per DATE,
    IN p_tip_doc_per VARCHAR(10),
    IN p_doc_per VARCHAR(20),
    IN p_dir_per VARCHAR(100),
    IN p_cel_per VARCHAR(20),
    IN p_cel2_per VARCHAR(20),
    IN p_email_per VARCHAR(100),
    IN p_cont_per VARCHAR(255),
    IN p_gen_per VARCHAR(20)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;

    START TRANSACTION;

    UPDATE 
        personas u
    SET
        u.nom_per = p_nom_per,
        u.ape_per = p_ape_per,
        u.fec_nac_per = p_fec_nac_per,
        u.tip_doc_per = p_tip_doc_per,
        u.dir_per = p_dir_per,
        u.cel_per = p_cel_per,
        u.cel2_per = p_cel2_per,
        u.email_per = p_email_per,
        u.cont_per = p_cont_per,
        u.gen_per = p_gen_per
    WHERE
        u.doc_per = p_doc_per;

    COMMIT;
    SET autocommit = 1;
END //
CREATE PROCEDURE e_commerce.SearchPeoples()
BEGIN
    SELECT
        u.nom_per,
        u.ape_per,
        u.fec_nac_per,
        u.tip_doc_per,
        u.doc_per,
        u.dir_per,
        u.cel_per,
        u.cel2_per,
        u.email_per,
        u.cont_per,
        u.gen_per,
        u.fec_cre_per,
        GROUP_CONCAT(r.nom_rol SEPARATOR ', ') AS roles
    FROM 
        personas u
    JOIN
        otorgar_roles otr ON otr.id_per = u.id_per
    JOIN
        roles r ON otr.id_rol = r.id_rol
    WHERE
        u.estado = 1
    GROUP BY 
        u.id_per
    LIMIT 100;
END //
CREATE PROCEDURE e_commerce.DeletePeople(
    IN p_by VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
     BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;

    START TRANSACTION;

    UPDATE
        personas u
    SET 
        u.estado = 0
    WHERE
        u.estado = 1
        AND (
            u.doc_per LIKE p_by
            OR u.email_per LIKE p_by
        );

    COMMIT;

    SET autocommit = 1;
END //