// Imports
const DataBase = require('./DataBase.service')
const Global = require('./Global.service')

// Main class
class Order {
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
            const proc = "CALL RegisterOrder(?,?,?,?,?);"
            const params = [
                this.args[0].documento_cliente,
                this.args[0].direccion_envio,
                this.args[0].metodo_pago_nombre,
                this.args[0].metodo_envio_nombre,
                this.args[0].productos_json
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

    // function to find all
    async findAll() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL GetAllOrders();"
            const keys = [
                'id_pro',
                'nom_pro',
                'pre_pro',
                'des_pro',
                'sta_pro',
                'onSale',
                'can_pro_ped',
                'url_img',
                'nom_col',
                'hex_col',
                'nom_tal_pro'
            ]

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    const resOne = this.global.format(result[0],'products',keys)
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: resOne
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find by
    async findBy() {
        return new Promise((res,rej) => {
            // vars
            const params = this.args[0]?.trim()
            const proc = "CALL GetOrderBy(?);"
            const keys = [
                'id_pro',
                'nom_pro',
                'pre_pro',
                'des_pro',
                'sta_pro',
                'onSale',
                'can_pro_ped',
                'url_img',
                'nom_col',
                'hex_col',
                'nom_tal_pro'
            ]

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,[params],(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    const resOne = this.global.format(result[0],'products',keys)
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: resOne
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
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
}

// Export
module.exports = Order