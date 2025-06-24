-- Active: 1747352860830@@127.0.0.1@3306@e_commerce
DROP DATABASE IF EXISTS e_commerce;
CREATE DATABASE e_commerce;

CREATE TABLE e_commerce.roles(
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nom_rol VARCHAR(100) NOT NULL,INDEX(nom_rol)
);

CREATE TABLE e_commerce.personas(
    id_per INT AUTO_INCREMENT PRIMARY KEY,
    nom_per VARCHAR(100) NOT NULL,
    ape_per VARCHAR(100) NOT NULL,
    fec_nac_per DATE NOT NULL,
    tip_doc_per VARCHAR(10) NOT NULL,
    doc_per VARCHAR(20) UNIQUE NOT NULL,INDEX(doc_per),
    dir_per VARCHAR(100) NOT NULL,
    cel_per VARCHAR(20) NOT NULL,
    cel2_per VARCHAR(20),
    email_per VARCHAR(100) UNIQUE NOT NULL,INDEX(email_per),
    pas_per VARCHAR(255) NOT NULL,
    gen_per VARCHAR(100) NOT NULL,
    estado BOOLEAN DEFAULT(1) NOT NULL,
    fot_per TEXT DEFAULT("https://imgs.search.brave.com/rL6dnhwCDXLvz02lsRs2QjVj1F8o-8D0o4pTYhmHah8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi9jL2M4L01h/cmllX0N1cmllX2Mu/XzE5MjBzLmpwZy81/MTJweC1NYXJpZV9D/dXJpZV9jLl8xOTIw/cy5qcGc") NOT NULL,
    fec_cre_per DATE DEFAULT(NOW()) NOT NULL
);

CREATE TABLE e_commerce.otorgar_roles(
    id_rol INT NOT NULL,INDEX(id_rol),FOREIGN KEY(id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE ON UPDATE CASCADE,
    id_per INT NOT NULL,INDEX(id_per),FOREIGN KEY(id_per) REFERENCES personas(id_per) ON DELETE CASCADE ON UPDATE CASCADE,
    fec_oto DATE DEFAULT(NOW()) NOT NULL,
    PRIMARY KEY(id_rol,id_per)
);

CREATE TABLE e_commerce.cat_productos(
    id_cat_pro INT AUTO_INCREMENT PRIMARY KEY,
    nom_cat_pro VARCHAR(100) NOT NULL,INDEX(nom_cat_pro),
    sta_cat_pro BOOLEAN DEFAULT(1) NOT NULL
);

CREATE TABLE e_commerce.productos(
    id_pro INT AUTO_INCREMENT PRIMARY KEY,
    cat_pro INT NOT NULL,INDEX(cat_pro), FOREIGN KEY(cat_pro) REFERENCES cat_productos(id_cat_pro) ON DELETE CASCADE ON UPDATE CASCADE,
    nom_pro VARCHAR(100) NOT NULL,INDEX(nom_pro),
    pre_pro DECIMAL(10,2) NOT NULL,INDEX(pre_pro),
    des_pro TEXT NOT NULL,
    img_pro TEXT DEFAULT('No-Registrado') NOT NULL,
    sta_pro ENUM("DISPONIBLE","NO-DISPONIBLE") DEFAULT("DISPONIBLE") NOT NULL # Estado del servicio
);

CREATE TABLE e_commerce.colores(
    id_col INT AUTO_INCREMENT PRIMARY KEY,
    nom_col VARCHAR(100) NOT NULL,INDEX(nom_col),
    hex_col VARCHAR(7) NOT NULL,INDEX(hex_col)
);

CREATE TABLE e_commerce.tallas(
    id_tal_pro INT AUTO_INCREMENT PRIMARY KEY,
    nom_tal_pro VARCHAR(100) NOT NULL,INDEX(nom_tal_pro)
);


CREATE TABLE e_commerce.inventario (
    id_inv INT AUTO_INCREMENT PRIMARY KEY,
    id_pro_inv INT NOT NULL,
    id_col_inv INT NOT NULL,
    id_tal_inv INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
    INDEX(id_pro_inv),
    INDEX(id_col_inv),
    INDEX(id_tal_inv),
    FOREIGN KEY (id_pro_inv) REFERENCES productos(id_pro) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_col_inv) REFERENCES colores(id_col) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_tal_inv) REFERENCES tallas(id_tal_pro) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY unique_inventario (id_pro_inv, id_col_inv, id_tal_inv) -- Evita duplicados
);

CREATE TABLE e_commerce.metodos_pagos(
    id_met_pag INT AUTO_INCREMENT PRIMARY KEY,
    nom_met_pag VARCHAR(100) NOT NULL,INDEX(nom_met_pag)
);

CREATE TABLE e_commerce.pedidos (
    id_ped INT AUTO_INCREMENT PRIMARY KEY,
    cli_ped INT NOT NULL,INDEX(cli_ped),FOREIGN KEY (cli_ped) REFERENCES personas(id_per) ON DELETE CASCADE ON UPDATE CASCADE,
    fec_ped DATE DEFAULT(CURRENT_DATE()),
    sta_ped ENUM('PENDIENTE', 'PROCESANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO') DEFAULT 'PENDIENTE',INDEX(sta_ped),
    dir_env_ped VARCHAR(200) NOT NULL,
    met_pag_ped INT NOT NULL,INDEX(met_pag_ped),FOREIGN KEY (met_pag_ped) REFERENCES personas(id_per) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE e_commerce.detalle_pedidos (
    id_det_ped INT AUTO_INCREMENT PRIMARY KEY,
    ped_det_ped INT NOT NULL COMMENT 'Pedido',INDEX(ped_det_ped),FOREIGN KEY (ped_det_ped) REFERENCES pedidos(id_ped) ON DELETE CASCADE ON UPDATE CASCADE,
    pro_det_ped INT NOT NULL COMMENT 'Producto',INDEX(pro_det_ped),FOREIGN KEY (pro_det_ped) REFERENCES productos(id_pro) ON DELETE CASCADE ON UPDATE CASCADE,
    can_det_ped INT NOT NULL COMMENT 'Cantidad',
    pre_uni_det_ped DECIMAL(10,2) NOT NULL COMMENT 'Precio por unidad',
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (can_det_ped * pre_uni_det_ped) STORED
);

-- Tabla para sesiones/usuarios únicos
CREATE TABLE e_commerce.sessions (
    id_ses VARCHAR(255) PRIMARY KEY,
    usu_id_ses VARCHAR(255),
    dir_ip_ses VARCHAR(45),
    user_agent_ses TEXT,
    device_type_ses VARCHAR(50),
    browser_ses VARCHAR(100),
    os_ses VARCHAR(100),
    first_visit_ses TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity_ses TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ref_ses VARCHAR(512),
    pai_ses VARCHAR(100),
    cit_ses VARCHAR(100)
);

-- Tabla para registros de página vistas
CREATE TABLE e_commerce.page_views (
    id_vie INT AUTO_INCREMENT PRIMARY KEY,
    id_ses_vie VARCHAR(255),INDEX(id_ses_vie),FOREIGN KEY (id_ses_vie) REFERENCES sessions(id_ses) ON DELETE CASCADE ON UPDATE CASCADE,
    url_pag_vie VARCHAR(512),
    tit_pag_vie VARCHAR(255),
    tim_vis_vie TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    time_spent INT -- en segundos
);

-- Tabla para eventos personalizados
CREATE TABLE e_commerce.custom_events (
    id_eve INT AUTO_INCREMENT PRIMARY KEY,
    id_ses_eve VARCHAR(255),INDEX(id_ses_eve),FOREIGN KEY (id_ses_eve) REFERENCES sessions(id_ses) ON DELETE CASCADE ON UPDATE CASCADE,
    nom_eve VARCHAR(255),
    dat_eve JSON,
    tim_eve TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* 
tabla de descuentos y promociones
tabla de devoluciones/reembolsos

Agregar campos de costo para calcular márgenes */