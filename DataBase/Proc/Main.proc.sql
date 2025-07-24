-- Active: 1747352860830@@127.0.0.1@3306@e_commerce
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
        p.pas_per,
        p.fot_per,
        GROUP_CONCAT(r.nom_rol SEPARATOR ', ') AS roles
    FROM
        personas p
    JOIN
        otorgar_roles otr ON otr.id_per = p.id_per
    JOIN
        roles r ON otr.id_rol = r.id_rol
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
CREATE PROCEDURE e_commerce.ChangePassword(
    IN p_email VARCHAR(100),
    IN p_passwd TEXT
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM personas WHERE email_per = p_email) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email ingresado no existe en el sistema';
    END IF;
    UPDATE
        personas p
    SET
        p.cont_per = p_passwd
    WHERE
        p.email_per = p_email;
END //