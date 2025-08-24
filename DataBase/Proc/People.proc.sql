-- Active: 1746130779175@@127.0.0.1@3306@e_commerce
CREATE PROCEDURE e_commerce.RegistPeoples(
    IN p_nom_per VARCHAR(100),
    IN p_nom2_per VARCHAR(100),
    IN p_ape_per VARCHAR(100),
    IN p_ape2_per VARCHAR(100),
    IN p_fec_nac_per DATE,
    IN p_tip_doc_per VARCHAR(10),
    IN p_doc_per VARCHAR(20),
    IN p_dir_per VARCHAR(100),
    IN p_cel_per VARCHAR(20),
    IN p_cel2_per VARCHAR(20),
    IN p_email_per VARCHAR(100),
    IN p_cont_per VARCHAR(255),
    IN p_gen_per VARCHAR(20),
    IN p_img_per VARCHAR(255)
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

    IF (SELECT id_per FROM personas WHERE doc_per = p_doc_per) THEN 
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Este numero de documento ya está registrado en el sistema';
    END IF;

    
    IF (SELECT id_per FROM personas WHERE email_per = p_email_per) THEN 
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Este correo electrónico ya está registrado en el sistema';
    END IF;

    INSERT INTO personas (
        nom_per,nom2_per,ape_per,ape2_per,fec_nac_per,tip_doc_per,doc_per,dir_per,cel_per,cel2_per,email_per,pas_per,gen_per,fot_per
    )
    VALUES (
        p_nom_per,p_nom2_per,p_ape_per,p_ape2_per,p_fec_nac_per,p_tip_doc_per,p_doc_per,p_dir_per,p_cel_per,p_cel2_per,p_email_per,p_cont_per,p_gen_per,p_img_per
    );

    SET p_id_persona = LAST_INSERT_ID();

    SELECT id_rol INTO p_id_rol FROM roles WHERE nom_rol = 'Usuario';

    INSERT INTO otorgar_roles(id_per,id_rol,fec_oto)
    VALUES (p_id_persona,p_id_rol,CURRENT_DATE());

    INSERT INTO preferencias (per_pre,theme) 
    VALUES (p_id_persona, 'LIGHT');

    COMMIT;
    SET autocommit = 1;
END //
CREATE PROCEDURE e_commerce.ModifyPeople(
    IN p_nom_per VARCHAR(100),
    IN p_nom2_per VARCHAR(100),
    IN p_ape_per VARCHAR(100),
    IN p_ape2_per VARCHAR(100),     
    IN p_fec_nac_per DATE,
    IN p_doc_per VARCHAR(20),
    IN p_dir_per VARCHAR(100),
    IN p_cel_per VARCHAR(20),
    IN p_cel2_per VARCHAR(20),
    IN p_email_per VARCHAR(100),
    IN p_gen_per VARCHAR(20),
    IN p_img_per VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;

    START TRANSACTION;

    IF (SELECT id_per FROM personas WHERE email_per = p_email_per) IS NULL THEN 
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Esta persona no está registrada en el sistema';
    END IF;

    UPDATE 
        personas p
    SET
        p.nom_per = p_nom_per,
        p.nom2_per = p_nom2_per,
        p.ape_per = p_ape_per,
        p.ape2_per = p_ape2_per,
        p.fec_nac_per = p_fec_nac_per,
        p.dir_per = p_dir_per,
        p.cel_per = p_cel_per,
        p.cel2_per = p_cel2_per,
        p.doc_per = p_doc_per,
        p.gen_per = p_gen_per,
        p.fot_per = p_img_per
    WHERE
        p.email_per = p_email_per;

    COMMIT;
    SET autocommit = 1;
END //
CREATE PROCEDURE e_commerce.ChangeRoles(
    IN p_add BOOLEAN,
    IN p_rol VARCHAR(100),
    IN p_email VARCHAR(100)
)
BEGIN
    DECLARE v_id_per INT;
    DECLARE v_id_rol INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;

    START TRANSACTION;

    SELECT id_per INTO v_id_per FROM personas WHERE email_per = p_email;
    IF (v_id_per) IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email ingresado no existe en el sistema';
    END IF;

    SELECT id_rol INTO v_id_rol FROM roles WHERE nom_rol LIKE p_rol;
    IF (v_id_rol) IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Rol ingresado no existe en el sistema';
    END IF;

    IF (p_add) THEN
        INSERT INTO e_commerce.otorgar_roles (id_rol, id_per)
        VALUES (v_id_rol, v_id_per);
    ELSE
        DELETE
        FROM e_commerce.otorgar_roles
        WHERE 
            id_per = v_id_per
            AND id_rol = v_id_rol;
    END IF;

    COMMIT;
    SET autocommit = 1;
END //
CREATE PROCEDURE e_commerce.SearchPeoples()
BEGIN
    IF NOT EXISTS(SELECT id_per FROM personas LIMIT 1) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No ahí personas registradas en el sistema';
    END IF;

    SELECT
        p.nom_per,
        p.nom2_per,
        p.ape_per,
        p.ape2_per,
        p.fec_nac_per,
        p.tip_doc_per,
        p.doc_per,
        p.dir_per,
        p.cel_per,
        p.cel2_per,
        p.email_per,
        p.pas_per,
        p.gen_per,
        p.estado,
        p.fec_cre_per,
        p.fot_per,
        GROUP_CONCAT(r.nom_rol SEPARATOR ', ') AS roles
    FROM 
        personas p
    JOIN
        otorgar_roles otr ON otr.id_per = p.id_per
    JOIN
        roles r ON otr.id_rol = r.id_rol
    WHERE
        p.estado LIKE 'DISPONIBLE'
    GROUP BY 
        p.id_per
    LIMIT 100;
END //
CREATE PROCEDURE e_commerce.SearchPeopleBy(
    IN p_by VARCHAR(100)
)
BEGIN
    IF NOT EXISTS(
        SELECT id_per FROM personas p WHERE p.doc_per = p_by
            OR p.email_per LIKE p_by LIMIT 1
        ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontro esta persona registrada en el sistema';
    END IF;

    SELECT
        p.nom_per,
        p.nom2_per,
        p.ape_per,
        p.ape2_per,
        p.fec_nac_per,
        p.tip_doc_per,
        p.doc_per,
        p.dir_per,
        p.cel_per,
        p.cel2_per,
        p.email_per,
        p.pas_per,
        p.gen_per,
        p.estado,
        p.fec_cre_per,
        p.fot_per,
        GROUP_CONCAT(r.nom_rol SEPARATOR ', ') AS roles
    FROM 
        personas p
    JOIN
        otorgar_roles otr ON otr.id_per = p.id_per
    JOIN
        roles r ON otr.id_rol = r.id_rol
    WHERE
        p.estado LIKE 'DISPONIBLE'
        AND (
            p.doc_per = p_by
            OR p.email_per LIKE p_by
        )
    ORDER BY
        p.id_per
    LIMIT 50;
END //

CREATE PROCEDURE e_commerce.SearchPeoplesBy(
    IN p_by VARCHAR(100)
)
BEGIN
    SELECT
        p.nom_per,
        p.nom2_per,
        p.ape_per,
        p.ape2_per,
        p.fec_nac_per,
        p.tip_doc_per,
        p.doc_per,
        p.dir_per,
        p.cel_per,
        p.cel2_per,
        p.email_per,
        p.pas_per,
        p.gen_per,
        p.estado,
        p.fec_cre_per,
        p.fot_per,
        GROUP_CONCAT(r.nom_rol SEPARATOR ', ') AS roles
    FROM 
        personas p
    JOIN
        otorgar_roles otr ON otr.id_per = p.id_per
    JOIN
        roles r ON otr.id_rol = r.id_rol
    WHERE
        p.estado LIKE 'DISPONIBLE'
        AND (
            r.nom_rol = p_by
            OR p.nom_per LIKE CONCAT('%',p_by,'%')
            OR p.ape_per LIKE CONCAT('%',p_by,'%')
            OR p.doc_per LIKE p_by
            OR p.email_per LIKE p_by
            OR p.gen_per LIKE CONCAT('%',p_by,'%')
            OR p.cel_per LIKE CONCAT('%',p_by,'%')
            OR p.tip_doc_per LIKE CONCAT('%',p_by,'%')
        )
    GROUP BY 
        p.id_per
    LIMIT 1000;
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

    IF (SELECT id_per FROM personas WHERE doc_per = p_by OR email_per LIKE p_by) IS NULL THEN 
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Esta persona no esta registrada en el sistema';
    END IF;

    UPDATE
        personas p
    SET 
        p.estado = 'NO-DISPONIBLE'
    WHERE
        p.estado LIKE 'DISPONIBLE'
        AND (
            p.doc_per LIKE p_by
            OR p.email_per LIKE p_by
        );

    COMMIT;

    SET autocommit = 1;
END //

/* DROP PROCEDURE e_commerce.`ModifyPeople`; */
/* DROP PROCEDURE e_commerce.`RegistPeoples`; */
/* DROP PROCEDURE e_commerce.SearchPeoples; */
/* DROP PROCEDURE e_commerce.`SearchPeoplesBy`; */
/* DROP PROCEDURE e_commerce.`SearchPeopleBy`; */
/* DROP PROCEDURE e_commerce.`DeletePeople`; */
/* DROP PROCEDURE e_commerce.`ChangeRoles`; */

/* CALL `SearchPeoples`(); */