-- Active: 1768620430430@@127.0.0.1@3306@e_commerce
DROP DATABASE IF EXISTS e_commerce;
CREATE DATABASE e_commerce;

CREATE TABLE IF NOT EXISTS e_commerce.roles(
    id_rol INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID del rol',
    nom_rol VARCHAR(100) UNIQUE NOT NULL,INDEX(nom_rol) COMMENT 'Nombre del rol',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
);

CREATE TABLE IF NOT EXISTS e_commerce.personas(
    id_per INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID de la persona',
    nom_per VARCHAR(100) NOT NULL COMMENT 'Nombre de la persona',INDEX(nom_per),
    nom2_per VARCHAR(100) DEFAULT 'N/A' COMMENT 'Segundo nombre de la persona',
    ape_per VARCHAR(100) NOT NULL COMMENT 'Apellido de la persona',INDEX(ape_per),
    ape2_per VARCHAR(100) DEFAULT 'N/A' COMMENT 'Segundo apellido de la persona',
    fec_nac_per DATE DEFAULT CURRENT_TIME NOT NULL COMMENT 'Fecha de nacimiento de la persona',
    tip_doc_per VARCHAR(10) DEFAULT 'CC' COMMENT 'Tipo de documento de la persona',
    doc_per VARCHAR(20) UNIQUE COMMENT 'Documento de la persona',INDEX(doc_per),
    dir_per VARCHAR(100) DEFAULT 'N/A' COMMENT 'Dirección de la persona',
    cel_per VARCHAR(20) DEFAULT 'N/A' COMMENT 'Celular de la persona',
    cel2_per VARCHAR(20) DEFAULT 'N/A' COMMENT 'Segundo celular de la persona',
    email_per VARCHAR(100) UNIQUE NOT NULL COMMENT 'Email de la persona',INDEX(email_per),
    pas_per VARCHAR(255) NOT NULL COMMENT 'Hash de la contraseña de la persona',
    gen_per VARCHAR(100) DEFAULT 'N/A' COMMENT 'Género de la persona',
    estado ENUM('DISPONIBLE','NO-DISPONIBLE') DEFAULT 'DISPONIBLE' NOT NULL COMMENT 'Estado de la persona',INDEX(estado),
    fot_per TEXT DEFAULT("N/A") COMMENT 'Foto de la persona',
    auth_provider ENUM('LOCAL','GOOGLE','FACEBOOK','TWITTER') DEFAULT 'LOCAL' NOT NULL COMMENT 'Proveedor de autenticación',INDEX(auth_provider),
    verificado BOOLEAN DEFAULT 0 NOT NULL COMMENT 'Indica si el email ha sido verificado',INDEX(verificado),
    fec_cre_per TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación' COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
);

CREATE TABLE IF NOT EXISTS e_commerce.otorgar_roles(
    id_rol INT NOT NULL COMMENT 'ID del rol',INDEX(id_rol),
    id_per INT NOT NULL COMMENT 'ID de la persona',INDEX(id_per),
    fec_oto DATE DEFAULT(CURRENT_DATE) NOT NULL COMMENT 'Fecha de otorgamiento del rol',
    PRIMARY KEY(id_rol,id_per),
    FOREIGN KEY(id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(id_per) REFERENCES personas(id_per) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS e_commerce.cat_productos(
    id_cat_pro INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID de la categoria',
    nom_cat_pro VARCHAR(100) UNIQUE NOT NULL COMMENT 'Nombre de la categoria',INDEX(nom_cat_pro),
    slug VARCHAR(100) UNIQUE NOT NULL COMMENT 'Slug de la categoria',INDEX(slug),
    des_cat_pro INT(3) DEFAULT 0 COMMENT 'Descuento de la categoria',
    sta_cat_pro BOOLEAN DEFAULT(1) NOT NULL COMMENT 'Estado de la categoria',INDEX(sta_cat_pro),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
);

CREATE TABLE IF NOT EXISTS e_commerce.marcas_productos(
    id_mar INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID de la marca',
    nom_mar VARCHAR(100) UNIQUE NOT NULL DEFAULT 'N/A' COMMENT "Nombre de la marca",INDEX(nom_mar),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
);

CREATE TABLE IF NOT EXISTS e_commerce.productos(
    id_pro INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID del producto',
    cat_pro INT NOT NULL COMMENT 'ID de la categoria',INDEX(cat_pro),
    nom_pro VARCHAR(100) UNIQUE NOT NULL COMMENT 'Nombre del producto',INDEX(nom_pro),
    mar_pro INT NOT NULL COMMENT "Marca del producto",INDEX(mar_pro),
    pre_ori_pro DECIMAL(10,2) NOT NULL COMMENT 'Precio original de compra del producto',
    pre_pro DECIMAL(10,2) NOT NULL COMMENT 'Precio del producto',INDEX(pre_pro),
    des_pre_pro INT(3) DEFAULT 0 COMMENT 'Descuento del producto',
    des_pro TEXT NOT NULL,
    onSale BOOLEAN DEFAULT 1,
    sta_pro ENUM('DISPONIBLE','NO-DISPONIBLE') DEFAULT 'DISPONIBLE' NOT NULL COMMENT 'Estado del producto',INDEX(sta_pro),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    FOREIGN KEY(cat_pro) REFERENCES cat_productos(id_cat_pro) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (mar_pro) REFERENCES marcas_productos(id_mar) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS e_commerce.colores(
    id_col INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID del color',
    nom_col VARCHAR(100) UNIQUE NOT NULL,INDEX(nom_col) COMMENT 'Nombre del color',
    hex_col VARCHAR(7) NOT NULL,INDEX(hex_col) COMMENT 'Código HEX del color',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
);

CREATE TABLE IF NOT EXISTS e_commerce.imagenes(
    id_img INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID de la imagen',
    nom_img VARCHAR(100) DEFAULT('N/A') NOT NULL COMMENT 'Nombre de la imagen',INDEX(nom_img),
    url_img TEXT DEFAULT('N/A') NOT NULL COMMENT 'URL de la imagen'
);

CREATE TABLE IF NOT EXISTS e_commerce.productos_colores(
    id_pro_col INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID producto-color',
    img_pro_col INT NOT NULL COMMENT 'ID imagen',INDEX(img_pro_col),
    pro_col_pro INT NOT NULL COMMENT 'ID producto',INDEX(pro_col_pro),
    col_pro_col INT NOT NULL COMMENT 'ID color',INDEX(col_pro_col),
    FOREIGN KEY (img_pro_col) REFERENCES imagenes(id_img) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (pro_col_pro) REFERENCES productos(id_pro) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (col_pro_col) REFERENCES colores(id_col) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS e_commerce.tallas(
    id_tal_pro INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID de la talla',
    nom_tal_pro VARCHAR(100) UNIQUE NOT NULL,INDEX(nom_tal_pro) COMMENT 'Nombre de la talla',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
);

CREATE TABLE IF NOT EXISTS e_commerce.entradas_inventario (
    id_ent INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID de la entrada de inventario',
    id_pro_ent INT NOT NULL COMMENT 'ID del producto',INDEX(id_pro_ent),
    can_ent INT NOT NULL COMMENT 'Cantidad ingresada',
    id_col_ent INT NOT NULL COMMENT 'ID del color',INDEX(id_col_ent),
    id_tal_ent INT NOT NULL COMMENT 'ID de la talla',INDEX(id_tal_ent),
    cos_uni_ent DECIMAL(10, 2) NOT NULL COMMENT 'Costo unitario',
    fec_ing_ent DATE NOT NULL COMMENT 'Fecha de ingreso',INDEX(fec_ing_ent),
    hor_ing_ent TIME NOT NULL COMMENT 'Hora de ingreso',
    not_ent TEXT COMMENT 'Notas adicionales',
    estado_ent BOOLEAN DEFAULT 0 COMMENT '0: Inactivo, 1: Activo',INDEX(estado_ent),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    FOREIGN KEY (id_pro_ent) REFERENCES productos(id_pro) ON DELETE RESTRICT ON UPDATE CASCADE
);
    
CREATE TABLE IF NOT EXISTS e_commerce.inventario (
    id_inv INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID inventario',
    id_pro_inv INT NOT NULL COMMENT 'ID producto',INDEX(id_pro_inv),
    id_col_inv INT NOT NULL COMMENT 'ID color',INDEX(id_col_inv),
    id_tal_inv INT NOT NULL COMMENT 'ID talla',INDEX(id_tal_inv),
    cantidad INT NOT NULL DEFAULT 0 COMMENT 'Cantidad disponible',
    cantidad_reservada INT NOT NULL DEFAULT 0 COMMENT 'Cantidad reservada',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    FOREIGN KEY (id_pro_inv) REFERENCES productos(id_pro) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_col_inv) REFERENCES colores(id_col) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_tal_inv) REFERENCES tallas(id_tal_pro) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY unique_inventario (id_pro_inv, id_col_inv, id_tal_inv) -- Evita duplicados
);

CREATE TABLE IF NOT EXISTS e_commerce.metodos_pagos(
    id_met_pag INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID del método de pago',
    nom_met_pag VARCHAR(100) UNIQUE NOT NULL COMMENT 'Nombre del método de pago',INDEX(nom_met_pag),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
);

CREATE TABLE IF NOT EXISTS e_commerce.metodos_envios(
    id_met_env INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID del método de envío',
    nom_met_env VARCHAR(100) UNIQUE NOT NULL COMMENT 'Nombre del método de envío',INDEX(nom_met_env),
    des_met_env TEXT DEFAULT 'N/A' COMMENT 'Descripción del método de envío',
    pre_met_env DECIMAL(10,2) DEFAULT 0 COMMENT 'Precio del método de envío',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
);

CREATE TABLE IF NOT EXISTS e_commerce.pedidos (
    id_ped INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID del pedido',
    cli_ped INT NOT NULL COMMENT 'ID cliente',INDEX(cli_ped),
    fec_ped DATE DEFAULT(CURRENT_DATE()) COMMENT 'Fecha del pedido',
    sta_ped ENUM('PENDIENTE', 'PROCESANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO') DEFAULT 'PENDIENTE' COMMENT 'Estado del pedido',INDEX(sta_ped),
    dir_env_ped VARCHAR(200) NOT NULL COMMENT 'Dirección de envío',
    fec_ent_ped DATE DEFAULT('0000-00-00') COMMENT 'Fecha de entrega estimada',
    met_pag_ped INT NOT NULL,INDEX(met_pag_ped) COMMENT 'Método de pago',
    met_env_ped INT NOT NULL,INDEX(met_env_ped) COMMENT 'Método de envío',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    FOREIGN KEY (cli_ped) REFERENCES personas(id_per) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (met_pag_ped) REFERENCES metodos_pagos(id_met_pag) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (met_env_ped) REFERENCES metodos_envios(id_met_env) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS e_commerce.productos_pedidos(
    id_ped INT NOT NULL COMMENT 'ID detalle de Pedido',INDEX(id_ped),
    pro_ped INT NOT NULL COMMENT 'Producto',INDEX(pro_ped),
    col_pro_ped INT NOT NULL COMMENT 'Color de producto',INDEX(col_pro_ped),
    img_pro_ped INT NOT NULL COMMENT 'Imagen del producto',INDEX(img_pro_ped),
    tal_pro_ped INT NOT NULL COMMENT 'Talla del producto',INDEX(tal_pro_ped),
    can_pro_ped INT NOT NULL COMMENT 'Cantidad de este producto',
    PRIMARY KEY(id_ped, pro_ped),
    FOREIGN KEY (id_ped) REFERENCES pedidos(id_ped) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (pro_ped) REFERENCES productos(id_pro) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (col_pro_ped) REFERENCES colores(id_col) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (img_pro_ped) REFERENCES imagenes(id_img) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (tal_pro_ped) REFERENCES tallas(id_tal_pro) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla para preferencias de usuarios
CREATE TABLE IF NOT EXISTS e_commerce.preferencias(
    id_pre INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID de la preferencia',
    per_pre INT NOT NULL,INDEX(per_pre) COMMENT 'ID de la persona',
    theme ENUM('DARK','LIGHT') DEFAULT 'LIGHT' COMMENT 'Tema de la interfaz',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    FOREIGN KEY (per_pre) REFERENCES personas(id_per) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS e_commerce.ofertas(
    id_ofe INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID de la oferta',
    nom_ofe VARCHAR(255) UNIQUE NOT NULL COMMENT 'Nombre de la oferta',INDEX(nom_ofe),
    des_ofe TEXT NOT NULL COMMENT 'Descripción de la oferta',
    dur_ofe INT DEFAULT 0 NOT NULL COMMENT 'duración de oferta en horas',
    fec_ini_ofe TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT 'Fecha de inicio de oferta',
    fec_fin_ofe TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT 'Fecha de fin de oferta',
    por_des_ofe INT DEFAULT 0 NOT NULL COMMENT 'Porcentaje de oferta',
    sta_ofe ENUM('PENDIENTE', 'ACTIVA', 'FINALIZADA') DEFAULT 'PENDIENTE',INDEX(sta_ofe) COMMENT 'Estado de la oferta',
    available BOOLEAN DEFAULT 1 NOT NULL COMMENT 'Oferta disponible',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
);

CREATE TABLE IF NOT EXISTS e_commerce.oferta_productos(
    ofe_pro INT NOT NULL COMMENT 'ID de la oferta',INDEX(ofe_pro),
    pro_ofe_pro INT NOT NULL COMMENT 'Producto',INDEX(pro_ofe_pro),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    PRIMARY KEY(ofe_pro,pro_ofe_pro),
    FOREIGN KEY(ofe_pro) REFERENCES ofertas(id_ofe) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (pro_ofe_pro) REFERENCES productos(id_pro) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS e_commerce.oferta_categoria_productos(
    ofe_pro INT NOT NULL,INDEX(ofe_pro) COMMENT 'ID de la oferta',
    cat_ofe_pro INT NOT NULL,INDEX(cat_ofe_pro) COMMENT 'ID de la categoría de producto',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de aplicación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    PRIMARY KEY(ofe_pro,cat_ofe_pro),
    FOREIGN KEY(ofe_pro) REFERENCES ofertas(id_ofe) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(cat_ofe_pro) REFERENCES cat_productos(id_cat_pro) ON DELETE CASCADE ON UPDATE CASCADE
);


-- Tabla para sesiones/usuarios únicos
CREATE TABLE IF NOT EXISTS e_commerce.sessions (
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
CREATE TABLE IF NOT EXISTS e_commerce.page_views (
    id_vie INT AUTO_INCREMENT PRIMARY KEY,
    id_ses_vie VARCHAR(255),INDEX(id_ses_vie),FOREIGN KEY (id_ses_vie) REFERENCES sessions(id_ses) ON DELETE CASCADE ON UPDATE CASCADE,
    url_pag_vie VARCHAR(512),
    tit_pag_vie VARCHAR(255),
    tim_vis_vie TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    time_spent INT -- en segundos
);

-- Tabla para eventos personalizados
CREATE TABLE IF NOT EXISTS e_commerce.custom_events (
    id_eve INT AUTO_INCREMENT PRIMARY KEY,
    id_ses_eve VARCHAR(255),INDEX(id_ses_eve),FOREIGN KEY (id_ses_eve) REFERENCES sessions(id_ses) ON DELETE CASCADE ON UPDATE CASCADE,
    nom_eve VARCHAR(255),
    dat_eve JSON,
    tim_eve TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Tabla para productos marcados en favorito
CREATE TABLE IF NOT EXISTS e_commerce.favoritos (
    id_fav INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID del favorito',
    id_per_fav INT NOT NULL COMMENT 'ID de la persona',INDEX(id_per_fav),
    id_pro_fav INT NOT NULL COMMENT 'ID del producto',INDEX(id_pro_fav),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    UNIQUE KEY unique_favorito (id_per_fav, id_pro_fav),
    FOREIGN KEY (id_per_fav) REFERENCES personas(id_per) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_pro_fav) REFERENCES productos(id_pro) ON DELETE CASCADE ON UPDATE CASCADE
);

--Tabla para carrito de compras
CREATE TABLE IF NOT EXISTS e_commerce.carrito (
    id_car INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID del carrito',
    id_per_car INT NOT NULL COMMENT 'ID de la persona',INDEX(id_per_car),
    id_inv_car INT NOT NULL COMMENT 'ID del inventario',INDEX(id_inv_car),
    cantidad INT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Cantidad del producto en el carrito',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    UNIQUE KEY unique_carrito_item (id_per_car, id_inv_car),
    FOREIGN KEY (id_per_car) REFERENCES personas(id_per) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_inv_car) REFERENCES inventario(id_inv) ON DELETE CASCADE ON UPDATE CASCADE
);

/* 
tabla de devoluciones/reembolsos
*/