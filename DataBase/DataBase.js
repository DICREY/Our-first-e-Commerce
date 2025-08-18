const roles = [
  { nom_rol: "Administrador" },
  { nom_rol: "Usuario" }
]

const personas = [
  {
  
    nom_per: "Juan",
    ape_per: "Pérez",
    fec_nac_per: new Date(),
    tip_doc_per: "CC",
    doc_per: "123450989",
    dir_per: "Calle 123 #45-67",
    cel_per: "3001234567",
    cel2_per: null,
    email_per: "juanperez@email.com",
    pas_per: "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    gen_per: "Masculino",
    fot_per: null,
    roles: [1, 2] // Administrador y Usuario
  },
  {
  
    nom_per: "María",
    ape_per: "Gómez",
    fec_nac_per: new Date(),
    tip_doc_per: "CC",
    doc_per: "876254321",
    dir_per: "Av. Principal #12-34",
    cel_per: "3102345678",
    cel2_per: "3203456789",
    email_per: "mariagomez@email.com",
    pas_per: "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    gen_per: "Femenino",
    fot_per: null,
    roles: [1, 2] // Administrador y Usuario
  },
  {
  
    nom_per: "Nikola",
    ape_per: "Tesla",
    fec_nac_per: new Date(),
    tip_doc_per: "CC",
    doc_per: "1298765432",
    dir_per: "Trasversal 12 #34-56",
    cel_per: "3186789012",
    cel2_per: "",
    email_per: "admin@gmail.com",
    pas_per: "$2b$15$P3DlhprB7vdchCiVoGq7SOrvG/ZOJyVVyTInPk7QZPbaKbUNPPQa6",
    gen_per: "Masculino",
    fot_per: "https://i.pinimg.com/1200x/65/ac/63/65ac63848534c4d00e84dbaf66b68056.jpg",
    roles: [1, 2] // Administrador y Usuario
  },
]

const categorias = [
  { 
   
    nom_cat_pro: "Ropa de Mujer",
    slug: "ropa-de-mujer"
  },
  { 
   
    nom_cat_pro: "Lencería",
    slug: "lenceria"
  },
  { 
   
    nom_cat_pro: "Ropa Deportiva Mujer",
    slug: "ropa-deportiva-mujer"
  }
]

const colores = [
  { nom_col: "Rojo", hex_col: "#FF0000" },
  { nom_col: "Negro", hex_col: "#000000" },
  { nom_col: "Blanco", hex_col: "#FFFFFF" },
  // ... otros colores
]

const productos = [
  {
  
    cat_pro: 1,
    nom_pro: "Blusa de seda estampada",
    mar_pro: 1,
    pre_pro: 45000.99,
    pre_ori_pro: 40000.99,
    des_pro: "Blusa elegante de seda con estampado floral",
    sta_pro: "DISPONIBLE",
    imagenes: [
      { color: 3, url: "https://i.pinimg.com/1200x/33/90/eb/3390eb933e22bf3a238bcf66eb2f3cfa.jpg" },
      { color: 2, url: "https://i.pinimg.com/736x/06/e7/22/06e72242f6b362f6f7c4b9a0d27c2209.jpg" }
    ],
    inventario: [
      { color: 2, talla: 1, cantidad: 10 },
      { color: 2, talla: 2, cantidad: 18 },
      // ... otros items de inventario
    ]
  },
  // ... otros productos con la misma estructura
]

const metodos_pago = [
  { nom_met_pag: "Tarjeta de Crédito" },
  { nom_met_pag: "Tarjeta de Débito" },
  // ... otros métodos de pago
]

const metodos_envio = [
  { 
   
    nom_met_env: "Servientrega", 
    pre_met_env: 5000, 
    des_met_env: "Envio rapido por medio de transporte terrestre" 
  }
]

const pedidos = [
  {
  
    cli_ped: 1,
    dir_env_ped: "Calle 123 #45-67, Bogotá",
    met_pag_ped: 1,
    met_env_ped: 1,
    sta_ped: "PENDIENTE",
    fec_ped: new Date("2025-09-20"),
    productos: [
      {
        pro_ped: 1,
        col_pro_ped: 2,
        img_pro_ped: 1,
        tal_pro_ped: 1,
        can_pro_ped: 2
      },
      {
        pro_ped: 6,
        col_pro_ped: 1,
        img_pro_ped: 12,
        tal_pro_ped: 1,
        can_pro_ped: 1
      }
    ]
  },
  // ... otros pedidos
]

const ofertas = [
  {
  
    nom_ofe: "Verano Sensual",
    des_ofe: "30% de descuento en toda nuestra colección de lencería para el verano",
    dur_ofe: 0,
    fec_ini_ofe: new Date("2025-08-01T00:00:00"),
    fec_fin_ofe: new Date("2025-08-31T23:59:59"),
    por_des_ofe: 30,
    categorias: [2], // Aplica a la categoría de lencería
    productos: []
  },
  {
  
    nom_ofe: "Flash Sale: Conjuntos de Encaje",
    des_ofe: "40% de descuento en conjuntos de encaje seleccionados por 48 horas",
    dur_ofe: 48,
    fec_ini_ofe: new Date("2025-08-15T09:00:00"),
    fec_fin_ofe: new Date("2025-08-17T09:00:00"),
    por_des_ofe: 40,
    categorias: [],
    productos: [8] // Aplica solo al producto con ID 8
  }
]

const preferencias = [
  { per_pre: 1, theme: "DARK" },
  { per_pre: 2, theme: "LIGHT" },
]