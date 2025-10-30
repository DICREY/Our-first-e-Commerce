// Imports
const DataBase = require('./DataBase.service')
const Global = require('./Global.service')

// Main class
class Product {
    // constructor
    constructor(...args) {
        this.database = new DataBase()
        this.global = new Global()
        this.args = args
    }

    // function to register
    async create() {
        return new Promise((res, rej) => {
            // vars
            const proc = "CALL RegisterProduct(?,?,?,?,?,?,?,?,?,?,?)"
            const params = [
                this.args[0].nom_pro,
                this.args[0].pre_ori_pro,
                this.args[0].pre_pro,
                this.args[0].des_pre_pro || 0,
                this.args[0].des_pro,
                this.args[0].onSale,
                this.args[0].nom_cat,
                this.args[0].slug_cat,
                this.args[0].nom_mar,
                JSON.stringify(this.args[0].colores),
                JSON.stringify(this.args[0].inv),
            ]

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc, params, (err) => {
                if (err) {
                    rej({ message: err })
                } else setTimeout(() => {
                    res({
                        message: "Registro exitoso",
                        success: true
                    })
                }, 1000)

            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to modify
    async modify() {
        return new Promise((res, rej) => {
            // data 
            const params = [
                this.args[0].id_pro,
                this.args[0].nom_pro,
                this.args[0].pre_ori_pro,
                this.args[0].pre_pro,
                this.args[0].des_pre_pro,
                this.args[0].des_pro,
                this.args[0].onSale,
                this.args[0].sta_pro,
                this.args[0].nom_cat_pro,
                this.args[0].slug,
                this.args[0].nom_mar,
                JSON.stringify(this.args[0].colors),
                JSON.stringify(this.args[0].inv)
            ]
            const proc = "CALL ModifyProduct(?,?,?,?,?,?,?,?,?,?,?,?,?)"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc, params, (err) => {
                if (err) {
                    rej({ message: err })
                } else setTimeout(() => {
                    res({
                        message: "Modificación exitosa",
                        success: true
                    })
                }, 1000)

            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to delete
    async ChangeStatus() {
        return new Promise((res, rej) => {
            // Vars
            const by = this.args[0]?.trim()
            const proc = "CALL ChangeStatusProduct(?)"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure and call procedure
            if (this.database) this.database.conection.query(proc, [by], (err) => {
                if (err) {
                    rej({ message: err })
                } else setTimeout(() => res({
                    message: "Product status changed",
                    success: 1
                }), 1000)
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to delete
    async delete() {
        return new Promise((res, rej) => {
            // Vars
            const by = this.args[0]?.trim()
            const procedure = "CALL DeleteProduct(?)"

            // conect to database
            const conection = conect()

            // verify conection and call procedure and call procedure
            if (conection) conection.query(procedure, [by], err => {
                if (err) {
                    rej(err)
                } else setTimeout(() => res({
                    message: "Product Deleted",
                    success: 1
                }), 1000)
            })

            // close conection 
            conection.end()
        })
    }

    // function to find all
    async findAll() {
        return new Promise((res, rej) => {
            // vars
            const proc = "CALL GetAllProducts()"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc, (err, result) => {
                if (err) {
                    rej({ message: err })
                } else if (result) {
                    const resOne = this.global.format(result[0], 'colors', ['nom_col', 'hex_col', 'nom_img', 'url_img', 'stock'])
                    const resTwo = this.global.format(resOne, 'inv', ['id_inv','nom_col', 'hex_col', 'stock', 'size'])
                    const lastRes = this.global.iterar(resTwo, 'sizes')
                    const lastLastRes = this.global.format(lastRes, 'offers', [
                        'id_ofe', 'nom_ofe', 'des_ofe', 'dur_ofe', 'fec_ini_ofe', 'fec_fin_ofe', 'por_des_ofe', 'created_at', 'updated_at'
                    ])
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: lastLastRes
                        })
                    }, 1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find all by
    async findAllBy() {
        return new Promise((res, rej) => {
            // vars
            const by = this.args[0]?.trim()
            const proc = "CALL GetProductsBy(?)"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc, [by], (err, result) => {
                if (err) {
                    rej({ message: err })
                } else if (result) {
                    const resOne = this.global.format(result[0], 'colors', ['nom_col', 'hex_col', 'nom_img', 'url_img'])
                    const resTwo = this.global.format(resOne, 'inv', [ 'id_inv','nom_col', 'hex_col', 'stock', 'size'])
                    const lastRes = this.global.iterar(resTwo, 'sizes')
                    const lastLastRes = this.global.format(lastRes, 'offers', [
                        'id_ofe', 'nom_ofe', 'des_ofe', 'dur_ofe', 'fec_ini_ofe', 'fec_fin_ofe', 'por_des_ofe', 'created_at', 'updated_at'
                    ])
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: lastLastRes
                        })
                    }, 1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })

    }
    // function to find all product categories
    async findAllCategories() {
        return new Promise((res, rej) => {
            // vars
            const proc = "CALL GetProductsCategories()"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc, (err, result) => {
                if (err) {
                    rej({ message: err })
                } else if (result) {
                    const resOne = this.global.format(result[0], 'colors', ['nom_col', 'hex_col', 'nom_img', 'url_img'])
                    const resTwo = this.global.format(resOne, 'inv', [ 'id_inv','nom_col', 'hex_col', 'stock', 'size'])
                    const lastRes = this.global.iterar(resTwo, 'sizes')
                    const lastLastRes = this.global.format(lastRes, 'offers', [
                        'id_ofe', 'nom_ofe', 'des_ofe', 'dur_ofe', 'fec_ini_ofe', 'fec_fin_ofe', 'por_des_ofe', 'created_at', 'updated_at'
                    ])
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: lastLastRes
                        })
                    }, 1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find all product colors
    async findAllColors() {
        return new Promise((res, rej) => {
            // vars
            const proc = "CALL GetProductsColors()"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc, (err, result) => {
                if (err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Products found",
                            result: result[0]
                        })
                    }, 1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find all product sizes
    async findAllSizes() {
        return new Promise((res, rej) => {
            // vars
            const proc = "CALL GetProductsSizes()"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc, (err, result) => {
                if (err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Products found",
                            result: result[0]
                        })
                    }, 1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find all product brands
    async findAllBrands() {
        return new Promise((res, rej) => {
            // vars
            const proc = "CALL GetProductsBrands()"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc, (err, result) => {
                if (err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Products found",
                            result: result[0]
                        })
                    }, 1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find by
    async findBy() {
        return new Promise((res, rej) => {
            // vars
            const by = this.args[0]?.trim()
            const proc = "CALL GetProductBy(?)"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc, [by], (err, result) => {
                if (err) {
                    rej({ message: err })
                } else if (result) {
                    const resOne = this.global.format(result[0], 'colors', ['nom_col', 'hex_col', 'nom_img', 'url_img', 'stock'])
                    const resTwo = this.global.format(resOne, 'inv', ['id_inv','nom_col', 'hex_col', 'stock', 'size'])
                    const lastRes = this.global.iterar(resTwo, 'sizes')
                    const lastLastRes = this.global.format(lastRes, 'offers', [
                        'id_ofe', 'nom_ofe', 'des_ofe', 'dur_ofe', 'fec_ini_ofe', 'fec_fin_ofe', 'por_des_ofe', 'created_at', 'updated_at'
                    ])
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: lastLastRes
                        })
                    }, 1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find by categorie
    async findByCategory() {
        return new Promise((res, rej) => {
            // vars
            const by = this.args[0]?.trim()
            const proc = "CALL GetProductsByCategory(?)"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc, by, (err, result) => {
                if (err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Products found",
                            result: result[0]
                        })
                    }, 1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // ============ CARRITO ============

    async addToCart() {
        return new Promise((res, rej) => {
            const proc = "CALL AddToCart(?, ?, ?)"
            const params = [
                this.args[0].user,
                this.args[0].id_inv,
                this.args[0].quantity
            ]

            this.database.conect()

            if (this.database) this.database.conection.query(proc, params, (err, result) => {
                this.database.conection.end()
                if (err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Producto agregado al carrito",
                            success: true,
                            result: result[0]
                        })
                    }, 1000)
                } else {
                    rej({ message: 'Error interno', status: 500 })
                }
            })
        })
    }

    async updateCartItem() {
        return new Promise((res, rej) => {
            const proc = "CALL UpdateCartQuantity(?, ?, ?)"
            const params = [
                this.args[0].userDoc,  // Cambiado de userId a userDoc
                this.args[0].cartId,
                this.args[0].newQuantity
            ]

            this.database.conect()

            if (this.database) this.database.conection.query(proc, params, (err, result) => {
                this.database.conection.end()
                if (err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Cantidad actualizada",
                            success: true,
                            result: result[0]
                        })
                    }, 1000)
                } else {
                    rej({ message: 'Error interno', status: 500 })
                }
            })
        })
    }

    async removeFromCart() {
        return new Promise((res, rej) => {
            const proc = "CALL RemoveFromCart(?, ?)"
            const params = [
                this.args[0].userDoc,  // Cambiado de userId a userDoc
                this.args[0].cartId
            ]

            this.database.conect()

            if (this.database) this.database.conection.query(proc, params, (err, result) => {
                this.database.conection.end()
                if (err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Producto eliminado del carrito",
                            success: true,
                            result: result[0]
                        })
                    }, 1000)
                } else {
                    rej({ message: 'Error interno', status: 500 })
                }
            })
        })
    }

    async getUserCart() {
        return new Promise((res, rej) => {
            const proc = "CALL GetUserCart(?)"
            const userDoc = this.args[0]  // Ahora espera el documento en lugar del ID

            this.database.conect()

            if (this.database) this.database.conection.query(proc, [userDoc], (err, result) => {
                this.database.conection.end()
                if (err) {
                    rej({ message: err })
                } else if (result) {
                    const formattedResult = this.global.format(result[0], 'products', [
                        'id_car', 'id_pro', 'nom_pro', 'pre_pro', 'des_pro',
                        'nom_col', 'hex_col', 'nom_tal_pro', 'cantidad', 'subtotal',
                        'imagen', 'stock_disponible'
                    ])

                    setTimeout(() => {
                        res({
                            message: "Carrito obtenido",
                            result: formattedResult
                        })
                    }, 1000)
                } else {
                    rej({ message: 'Error interno', status: 500 })
                }
            })
        })
    }

    // ============ FAVORITOS ============
    async addToFavorites() {
        return new Promise((res, rej) => {
            const proc = "CALL AddToFavorites(?,?)"
            const params = [
                this.args[0].email,
                this.args[0].productId
            ]

            this.database.conect()

            if (this.database) this.database.conection.query(proc, params, (err, result) => {
                this.database.conection.end()
                if (err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Producto agregado a favoritos",
                            success: true,
                            result: result?.[0]
                        })
                    }, 1000)
                } else {
                    rej({ message: 'Error interno', status: 500 })
                }
            })
        })
    }

    async removeFromFavorites() {
        return new Promise((res, rej) => {
            const proc = "CALL RemoveFromFavorites(?, ?)"
            const params = [
                this.args[0].email,  // Cambiado de userId a userDoc
                this.args[0].productId
            ]

            this.database.conect()

            if (this.database) this.database.conection.query(proc, params, (err, result) => {
                this.database.conection.end()
                if (err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Producto eliminado de favoritos",
                            success: true,
                            result: result[0]
                        })
                    }, 1000)
                } else {
                    rej({ message: 'Error interno', status: 500 })
                }
            })
        })
    }

    async getUserFavorites() {
        return new Promise((res, rej) => {
            const proc = "CALL GetUserFavorites(?)"
            const email = this.args[0]

            this.database.conect()

            if (this.database) this.database.conection.query(proc, [email], (err, result) => {
                this.database.conection.end()
                if (err) {
                    rej({ message: err })
                } else if (result) {
                    const resOne = this.global.format(result[0], 'colors', ['nom_col', 'hex_col', 'nom_img', 'url_img'])
                    const lastRes = this.global.iterar(resOne, 'sizes')

                    setTimeout(() => {
                        res({
                            message: "Favoritos obtenidos",
                            result: lastRes
                        })
                    }, 1000)
                } else {
                    rej({ message: 'Error interno', status: 500 })
                }
            })
        })
    }

    async getProductInventory() {
        return new Promise((res, rej) => {
            const proc = "CALL GetProductBy(?)"
            const productId = this.args[0]

            this.database.conect()

            if (this.database) this.database.conection.query(proc, [productId], (err, result) => {
                this.database.conection.end()
                if (err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Inventario encontrado",
                            result: result[0]
                        })
                    }, 500)
                } else {
                    rej({ message: 'Error interno', status: 500 })
                }
            })
        })
    }
}

// Export
module.exports = Product