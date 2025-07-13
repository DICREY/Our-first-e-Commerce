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
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL RegisterProduct(?,?,?,?,?,?,?,?,?,?);"
            const params = [
                this.args[0].nom_pro,
                this.args[0].pre_pro,
                this.args[0].des_pro,
                this.args[0].onSale,
                this.args[0].nom_cat,
                this.args[0].slug_cat,
                this.args[0].colores,
                this.args[0].hex_colores,
                this.args[0].tallas,
                this.args[0].imgs
            ]

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc, params,(err) => {
                if(err) {
                    rej({ message: err })
                } else setTimeout(() => {
                    res({
                        message: "Registro exitoso",
                        success: true
                    })
                },1000)
                
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to modify
    async modify() {
        return new Promise((res,rej) => {
            // data 
            const params = [
                this.args[0].nom_pro,
                this.args[0].pre_pro,
                this.args[0].des_pro,
                this.args[0].onSale,
                this.args[0].nom_cat,
                this.args[0].slug_cat,
                this.args[0].colores,
                this.args[0].hex_colores,
                this.args[0].tallas,
                this.args[0].imgs
            ]
            const procedure = "CALL ModifyProduct(?,?,?,?,?,?,?,?,?,?,?);"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc, params,(err) => {
                if(err) {
                    rej({ message: err })
                } else setTimeout(() => {
                    res({
                        message: "Modificación exitosa",
                        success: true
                    })
                },1000)
                
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to delete
    async delete() {
        return new Promise((res,rej) => {
            // Vars
            const by = this.args[0]?.trim()
            const procedure = "CALL DeleteProduct(?);"

            // conect to database
            const conection = conect()

            // verify conection and call procedure and call procedure
            if (conection) conection.query(procedure,[by],err => { 
                if(err) {
                    rej(err)
                } else setTimeout(() => res({
                    message: "Product Deleted",
                    success: 1
                }),1000)
            })

            // close conection 
            conection.end()
        })
    }

    async test() {
        return new Promise((res,rej) => {
            // vars
            const proc = "INSERT INTO e_commerce.colores (hex_col) VALUES (?);"
            const params = [
                this.args[0].key_col
            ]

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc, params,(err) => {
                if(err) {
                    rej({ message: err })
                } else setTimeout(() => {
                    res({
                        message: "Registro exitoso",
                        success: true
                    })
                },1000)
                
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find all
    async findAll() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL GetAllProducts();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    const resOne = this.global.format(result[0],'colors',['nom_col','hex_col','nom_img','url_img'])
                    const lastRes = this.global.iterar(resOne,'sizes')
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: lastRes
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }
    
    // function to find all by
    async findAllBy() {
        return new Promise((res,rej) => {
            // vars
            const by = this.args[0]?.trim()
            const proc = "CALL GetProductsBy(?);"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,[by],(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    const resOne = this.global.format(result[0],'colors',['nom_col','hex_col','nom_img','url_img'])
                    const lastRes = this.global.iterar(resOne,'sizes')
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: lastRes
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    
    }
    // function to find all product categories
    async findAllCategories() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL GetProductsCategories();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Products found",
                            result: result[0]
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find all product colors
    async findAllColors() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL GetProductsColors();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Products found",
                            result: result[0]
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find all product sizes
    async findAllSizes() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL GetProductsSizes();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Products found",
                            result: result[0]
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find by
    async findBy(data) {
        return new Promise((res,rej) => {
            // vars
            const by = data?.replace(":","").replace(" ","")
            const proc = "CALL GetProductBy(?);"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,by,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Products found",
                            result: result[0]
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find by categorie
    async findByCategory() {
        return new Promise((res,rej) => {
            // vars
            const by = this.args[0]?.trim()
            const proc = "CALL GetProductsByCategory(?);"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,by,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Products found",
                            result: result[0]
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }
}

// Export
module.exports = Product