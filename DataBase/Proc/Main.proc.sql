-- Active: 1768620430430@@127.0.0.1@3306@e_commerce
CREATE PROCEDURE e_commerce.Login(
    IN p_firstData VARCHAR(100)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM personas WHERE email_per = p_firstData) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email ingresado no existe en el sistema';
    END IF;
    SELECT
        p.nom_per,
        p.ape_per,
        p.doc_per,
        p.email_per,
        p.pas_per,
        p.fot_per,
        pr.theme,
        GROUP_CONCAT(r.nom_rol SEPARATOR ', ') AS roles
    FROM
        personas p
    JOIN
        otorgar_roles otr ON otr.id_per = p.id_per
    JOIN
        roles r ON otr.id_rol = r.id_rol
    JOIN
        preferencias pr ON pr.per_pre = p.id_per
    WHERE
        p.estado = 1
        AND (
                p.email_per = p_firstData
                OR p.doc_per = p_firstData
            )
    ORDER BY 
        p.nom_per
    LIMIT 1000;
END //
CREATE PROCEDURE e_commerce.GoogleLogin(
    IN p_email VARCHAR(100),
    IN p_nom VARCHAR(100),
    IN p_ape VARCHAR(100),
    IN p_fec_nac DATE,
    IN p_passwd TEXT,
    IN p_gen VARCHAR(50),
    IN p_url_img TEXT,
    IN p_theme VARCHAR(20)
)
BEGIN
    DECLARE p_id_persona INT;
    DECLARE p_id_rol INT;
    DECLARE v_exists INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
     BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;

    START TRANSACTION;

    IF NOT EXISTS (SELECT 1 FROM personas WHERE email_per = p_email) THEN
        INSERT INTO personas (
            email_per,
            nom_per,
            ape_per,
            fec_nac_per,
            pas_per,
            gen_per,
            fot_per, 
            auth_provider,
            verificado
        ) VALUES (
            p_email,
            p_nom,
            p_ape,
            p_fec_nac,
            p_passwd,
            p_gen,
            p_url_img,
            'GOOGLE',
            1
        );

        SET p_id_persona = LAST_INSERT_ID();

        SELECT id_rol INTO p_id_rol FROM roles WHERE nom_rol = 'Usuario';

        INSERT INTO otorgar_roles(id_per,id_rol,fec_oto)
        VALUES (p_id_persona,p_id_rol,CURRENT_DATE());

        INSERT INTO preferencias (per_pre,theme) 
        VALUES (p_id_persona, p_theme);
    END IF;

    SELECT
        p.nom_per,
        p.ape_per,
        p.doc_per,
        p.email_per,
        p.pas_per,
        p.fot_per,
        pr.theme,
        GROUP_CONCAT(r.nom_rol SEPARATOR ', ') AS roles
    FROM
        personas p
    JOIN
        otorgar_roles otr ON otr.id_per = p.id_per
    JOIN
        roles r ON otr.id_rol = r.id_rol
    JOIN
        preferencias pr ON pr.per_pre = p.id_per
    WHERE
        p.estado = 1
        AND p.email_per = p_email
    ORDER BY 
        p.nom_per
    LIMIT 1000;
    

    COMMIT;
    SET autocommit = 1;
END //
CREATE PROCEDURE e_commerce.ChangePassword(
    IN p_email VARCHAR(100),
    IN p_passwd TEXT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    SET autocommit = 0;

    START TRANSACTION;

    IF NOT EXISTS (SELECT 1 FROM personas WHERE email_per = p_email) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email ingresado no existe en el sistema';
    END IF;

    UPDATE
        personas p
    SET
        p.pas_per = p_passwd
    WHERE
        p.email_per = p_email;

    /* SELECT pas_per FROM personas WHERE email_per = p_email; */

    COMMIT;
    
    SET autocommit = 1;
END //

CREATE PROCEDURE e_commerce.ChangeTheme(
    IN p_doc VARCHAR(100),
    IN p_theme VARCHAR(100)
)
BEGIN
    DECLARE p_id_per INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET autocommit = 0;

    START TRANSACTION;

    SELECT id_per INTO p_id_per FROM personas WHERE doc_per = p_doc;

    IF (p_id_per) IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Documento ingresado no existe en el sistema';
    END IF;

    IF (p_theme) IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tema ingresado no es válido';
    END IF;

    IF (p_theme LIKE 'DARK') THEN
        UPDATE
            preferencias p
        SET
            p.theme = 'LIGHT'
        WHERE
            p.per_pre = p_id_per;
    ELSE
        UPDATE
            preferencias p
        SET
            p.theme = 'DARK'
        WHERE
            p.per_pre = p_id_per;
    END IF;

    SELECT
        p.theme
    FROM
        preferencias p
    WHERE
        p.per_pre = p_id_per;

    COMMIT;

    SET autocommit = 1;
END //

-- DROP PROCEDURE e_commerce.`Login`;
-- DROP PROCEDURE e_commerce.`ChangePassword`;
-- DROP PROCEDURE e_commerce.`GoogleLogin`;
-- DROP PROCEDURE e_commerce.ChangeTheme;

-- CALL e_commerce.Login('admin@gmail.com');
-- CALL e_commerce.GoogleLogin('test@gmail.com','testName','testLastName','31312312','test123','test.jpg');
-- CALL e_commerce.ChangePassword('admin@gmail.com', 'Perra123');