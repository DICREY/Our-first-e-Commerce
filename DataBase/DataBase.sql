-- Active: 1768620430430@@127.0.0.1@3306@e_commerce
DROP DATABASE IF EXISTS e_commerce;
CREATE DATABASE e_commerce;

CREATE TABLE e_commerce.roles(
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nom_rol VARCHAR(100) NOT NULL,INDEX(nom_rol),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
);

CREATE TABLE e_commerce.personas(
    id_per INT AUTO_INCREMENT PRIMARY KEY,
    nom_per VARCHAR(100) NOT NULL,
    nom2_per VARCHAR(100) DEFAULT 'N/A',
    ape_per VARCHAR(100) NOT NULL,
    ape2_per VARCHAR(100) DEFAULT 'N/A',
    fec_nac_per DATE DEFAULT CURRENT_TIME NOT NULL,
    tip_doc_per VARCHAR(10) DEFAULT 'CC',
    doc_per VARCHAR(20) UNIQUE,INDEX(doc_per),
    dir_per VARCHAR(100) DEFAULT 'N/A',
    cel_per VARCHAR(20) DEFAULT 'N/A' ,
    cel2_per VARCHAR(20) DEFAULT 'N/A' ,
    email_per VARCHAR(100) UNIQUE NOT NULL,INDEX(email_per),
    pas_per VARCHAR(255) NOT NULL,
    gen_per VARCHAR(100) DEFAULT 'N/A',
    estado ENUM('DISPONIBLE','NO-DISPONIBLE') DEFAULT 'DISPONIBLE' NOT NULL, # Estado de la persona
    fot_per TEXT DEFAULT("N/A"),
    auth_provider ENUM('LOCAL','GOOGLE','FACEBOOK','TWITTER') DEFAULT 'LOCAL' NOT NULL,
    verificado BOOLEAN DEFAULT 0 NOT NULL,
    fec_cre_per TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
);

CREATE TABLE e_commerce.otorgar_roles(
    id_rol INT NOT NULL,INDEX(id_rol),FOREIGN KEY(id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE ON UPDATE CASCADE,
    id_per INT NOT NULL,INDEX(id_per),FOREIGN KEY(id_per) REFERENCES personas(id_per) ON DELETE CASCADE ON UPDATE CASCADE,
    fec_oto DATE DEFAULT(CURRENT_DATE) NOT NULL,
    PRIMARY KEY(id_rol,id_per)
);

CREATE TABLE e_commerce.cat_productos(
    id_cat_pro INT AUTO_INCREMENT PRIMARY KEY,
    nom_cat_pro VARCHAR(100) NOT NULL,INDEX(nom_cat_pro),
    slug VARCHAR(100) UNIQUE NOT NULL,
    des_cat_pro INT(3) DEFAULT 0 COMMENT 'Descuento de la categoria',
    sta_cat_pro BOOLEAN DEFAULT(1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
);

CREATE TABLE e_commerce.marcas_productos(
    id_mar INT AUTO_INCREMENT PRIMARY KEY,
    nom_mar VARCHAR(100) NOT NULL DEFAULT 'N/A' COMMENT "Nombre de la marca",INDEX(nom_mar),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
);

CREATE TABLE e_commerce.productos(
    id_pro INT AUTO_INCREMENT PRIMARY KEY,
    cat_pro INT NOT NULL,INDEX(cat_pro), FOREIGN KEY(cat_pro) REFERENCES cat_productos(id_cat_pro) ON DELETE CASCADE ON UPDATE CASCADE,
    nom_pro VARCHAR(100) NOT NULL,INDEX(nom_pro),
    mar_pro INT NOT NULL COMMENT "Marca del producto",INDEX(mar_pro), FOREIGN KEY (mar_pro) REFERENCES marcas_productos(id_mar) ON DELETE CASCADE ON UPDATE CASCADE,
    pre_ori_pro DECIMAL(10,2) NOT NULL,INDEX(pre_pro) COMMENT 'Precio original de compra del producto',
    pre_pro DECIMAL(10,2) NOT NULL,INDEX(pre_pro),
    des_pre_pro INT(3) DEFAULT 0 COMMENT 'Descuento del producto',
    des_pro TEXT NOT NULL,
    onSale BOOLEAN DEFAULT 1,
    sta_pro ENUM('DISPONIBLE','NO-DISPONIBLE') DEFAULT 'DISPONIBLE' NOT NULL, # Estado del producto
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
);

CREATE TABLE e_commerce.colores(
    id_col INT AUTO_INCREMENT PRIMARY KEY,
    nom_col VARCHAR(100) NOT NULL,INDEX(nom_col),
    hex_col VARCHAR(7) NOT NULL,INDEX(hex_col)
);
CREATE TABLE e_commerce.imagenes(
    id_img INT AUTO_INCREMENT PRIMARY KEY,
    nom_img VARCHAR(100) DEFAULT('N/A') NOT NULL,INDEX(nom_img),
    url_img TEXT DEFAULT('N/A') NOT NULL
);

CREATE TABLE e_commerce.productos_colores(
    id_pro_col INT AUTO_INCREMENT PRIMARY KEY,
    img_pro_col INT NOT NULL,INDEX(img_pro_col),FOREIGN KEY (img_pro_col) REFERENCES imagenes(id_img) ON DELETE CASCADE ON UPDATE CASCADE,
    pro_col_pro INT NOT NULL,INDEX(pro_col_pro),FOREIGN KEY (pro_col_pro) REFERENCES productos(id_pro) ON DELETE CASCADE ON UPDATE CASCADE,
    col_pro_col INT NOT NULL,INDEX(col_pro_col),FOREIGN KEY (col_pro_col) REFERENCES colores(id_col) ON DELETE CASCADE ON UPDATE CASCADE
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
    nom_met_pag VARCHAR(100) NOT NULL,INDEX(nom_met_pag),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
);

CREATE TABLE e_commerce.metodos_envios(
    id_met_env INT AUTO_INCREMENT PRIMARY KEY,
    nom_met_env VARCHAR(100) NOT NULL,INDEX(nom_met_env),
    des_met_env TEXT DEFAULT 'N/A',
    pre_met_env DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
);

CREATE TABLE e_commerce.pedidos (
    id_ped INT AUTO_INCREMENT PRIMARY KEY,
    cli_ped INT NOT NULL,INDEX(cli_ped),FOREIGN KEY (cli_ped) REFERENCES personas(id_per) ON DELETE CASCADE ON UPDATE CASCADE,
    fec_ped DATE DEFAULT(CURRENT_DATE()),
    sta_ped ENUM('PENDIENTE', 'PROCESANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO') DEFAULT 'PENDIENTE',INDEX(sta_ped),
    dir_env_ped VARCHAR(200) NOT NULL,
    fec_ent_ped DATE DEFAULT('0000-00-00'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    met_pag_ped INT NOT NULL,INDEX(met_pag_ped),FOREIGN KEY (met_pag_ped) REFERENCES metodos_pagos(id_met_pag) ON DELETE CASCADE ON UPDATE CASCADE,
    met_env_ped INT NOT NULL,INDEX(met_env_ped),FOREIGN KEY (met_env_ped) REFERENCES metodos_envios(id_met_env) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE e_commerce.productos_pedidos(
    id_ped INT NOT NULL COMMENT 'ID detalle de Pedido',INDEX(id_ped),FOREIGN KEY (id_ped) REFERENCES pedidos(id_ped) ON DELETE CASCADE ON UPDATE CASCADE,
    pro_ped INT NOT NULL COMMENT 'Producto',INDEX(pro_ped),FOREIGN KEY (pro_ped) REFERENCES productos(id_pro) ON DELETE CASCADE ON UPDATE CASCADE,
    col_pro_ped INT NOT NULL COMMENT 'Color de producto',INDEX(col_pro_ped),FOREIGN KEY (col_pro_ped) REFERENCES colores(id_col) ON DELETE CASCADE ON UPDATE CASCADE,
    img_pro_ped INT NOT NULL COMMENT 'Imagen del producto',INDEX(img_pro_ped),FOREIGN KEY (img_pro_ped) REFERENCES imagenes(id_img) ON DELETE CASCADE ON UPDATE CASCADE,
    tal_pro_ped INT NOT NULL COMMENT 'Talla del producto',INDEX(tal_pro_ped),FOREIGN KEY (tal_pro_ped) REFERENCES tallas(id_tal_pro) ON DELETE CASCADE ON UPDATE CASCADE,
    can_pro_ped INT NOT NULL COMMENT 'Cantidad de este producto',
    PRIMARY KEY(id_ped, pro_ped)
);

-- Tabla para preferencias de usuarios
CREATE TABLE e_commerce.preferencias(
    id_pre INT AUTO_INCREMENT PRIMARY KEY,
    per_pre INT NOT NULL,INDEX(per_pre),FOREIGN KEY (per_pre) REFERENCES personas(id_per) ON DELETE CASCADE ON UPDATE CASCADE,
    theme ENUM('DARK','LIGHT') DEFAULT 'LIGHT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
);

CREATE TABLE e_commerce.ofertas(
    id_ofe INT AUTO_INCREMENT PRIMARY KEY,
    nom_ofe VARCHAR(255) NOT NULL,
    des_ofe TEXT NOT NULL,
    dur_ofe INT DEFAULT 0 NOT NULL COMMENT 'duración de oferta en horas',
    fec_ini_ofe TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fec_fin_ofe TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    por_des_ofe INT DEFAULT 0 NOT NULL COMMENT 'Porcentaje de oferta',
    sta_ofe ENUM('PENDIENTE', 'ACTIVA', 'FINALIZADA') DEFAULT 'PENDIENTE',INDEX(sta_ofe),
    available BOOLEAN DEFAULT 1 NOT NULL COMMENT 'Oferta disponible',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
);
CREATE TABLE e_commerce.oferta_productos(
    ofe_pro INT NOT NULL,INDEX(ofe_pro),  FOREIGN KEY(ofe_pro) REFERENCES ofertas(id_ofe) ON DELETE CASCADE ON UPDATE CASCADE,
    pro_ofe_pro INT NOT NULL COMMENT 'Producto',INDEX(pro_ofe_pro),FOREIGN KEY (pro_ofe_pro) REFERENCES productos(id_pro) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de aplicación',
    PRIMARY KEY(ofe_pro,pro_ofe_pro)
);

CREATE TABLE e_commerce.oferta_categoria_productos(
    ofe_pro INT NOT NULL,INDEX(ofe_pro),  FOREIGN KEY(ofe_pro) REFERENCES ofertas(id_ofe) ON DELETE CASCADE ON UPDATE CASCADE,
    cat_ofe_pro INT NOT NULL,INDEX(cat_ofe_pro), FOREIGN KEY(cat_ofe_pro) REFERENCES cat_productos(id_cat_pro) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de aplicación',
    PRIMARY KEY(ofe_pro,cat_ofe_pro)
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
    last_activity_ses TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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

--Tabla para productos marcados en favorito
CREATE TABLE e_commerce.favoritos (
    id_fav INT AUTO_INCREMENT PRIMARY KEY,
    id_per_fav INT NOT NULL,INDEX(id_per_fav),FOREIGN KEY (id_per_fav) REFERENCES personas(id_per) ON DELETE CASCADE ON UPDATE CASCADE,
    id_pro_fav INT NOT NULL,INDEX(id_pro_fav),FOREIGN KEY (id_pro_fav) REFERENCES productos(id_pro) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    UNIQUE KEY unique_favorito (id_per_fav, id_pro_fav) 
);

--Tabla para carrito de compras
CREATE TABLE e_commerce.carrito (
    id_car INT AUTO_INCREMENT PRIMARY KEY,
    id_per_car INT NOT NULL,INDEX(id_per_car),FOREIGN KEY (id_per_car) REFERENCES personas(id_per) ON DELETE CASCADE ON UPDATE CASCADE,
    id_inv_car INT NOT NULL,INDEX(id_inv_car),FOREIGN KEY (id_inv_car) REFERENCES inventario(id_inv) ON DELETE CASCADE ON UPDATE CASCADE,
    cantidad INT NOT NULL DEFAULT 1 CHECK (cantidad > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_carrito_item (id_per_car, id_inv_car)
);

/* 
tabla de descuentos y promociones
tabla de devoluciones/reembolsos

Agregar campos de costo para calcular márgenes */