// Imports
const DataBase = require('./DataBase.service')
const Global = require('./Global.service')

// Main class
class Offer {
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
            const params = [
                this.args[0].nom_ofe,
                this.args[0].des_ofe,
                this.args[0].dur_ofe,
                this.args[0].fec_ini_ofe,
                this.args[0].fec_fin_ofe,
                this.args[0].por_des_ofe,
                JSON.stringify(this.args[0].products) || null,
                JSON.stringify(this.args[0].categories) || null
            ]
            const proc = "CALL RegisterOffer(?,?,?,?,?,?,?,?);"

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
                this.args[0].id_ofe,
                this.args[0].nom_ofe,
                this.args[0].des_ofe,
                this.args[0].dur_ofe,
                this.args[0].fec_ini_ofe,
                this.args[0].fec_fin_ofe,
                this.args[0].por_des_ofe,
                JSON.stringify(this.args[0].products) || null,
                JSON.stringify(this.args[0].categories) || null
            ]
            const proc = "CALL ModifyOffer(?,?,?,?,?,?,?,?,?);"

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
    async ChangeState() {
        return new Promise((res,rej) => {
            // Vars
            const by = this.args[0]?.trim()
            const procedure = "CALL ChangeStateOffer(?);"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure and call procedure
            if (this.database) this.database.conection.query(procedure,[by],err => { 
                if(err) {
                    rej(err)
                } else setTimeout(() => res({
                    message: "Offer Deleted",
                    success: 1
                }),1000)
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
            const procedure = "CALL DeactivateOffer(?);"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure and call procedure
            if (this.database) this.database.conection.query(procedure,[by],err => { 
                if(err) {
                    rej(err)
                } else setTimeout(() => res({
                    message: "Offer Deactivated",
                    success: 1
                }),1000)
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to find all
    async findAll() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL GetAllOffers();"
            const keys = [
                [
                    'id_cat_pro',
                    'nom_cat_pro',
                    'slug',
                    'des_cat_pro',
                    'sta_cat_pro',
                    'created_at',
                    'updated_at'
                ],
                [
                    'id_pro',
                    'nom_pro',
                    'des_pro',
                    'pre_pro',
                    'sta_pro',
                    'created_at',
                    'updated_at'
                ]
            ]


            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    const resOne = this.global.format(result[0],'Categories',keys[0])
                    const resTwo = this.global.format(resOne,'Products',keys[1])
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            result: resTwo
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

    async offerProduct() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL GetOfferProduct();"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    console.log(result[0]?.[0])
                    setTimeout(() => {
                        res({
                            message: "Info found",
                            success: 1,
                            result: result?.[0]?.[0]
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
module.exports = Offer