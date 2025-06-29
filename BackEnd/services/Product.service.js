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
                if(err) rej({ message: err })
                if(!result || !result[0][0]) rej({
                    message: "Not found",
                    status: 404
                })
                const resOne = this.global.format(result[0],'colors',['nom_col','hex_col'])
                const lastRes = this.global.iterar(resOne,'sizes')
                setTimeout(() => {
                    res({
                        message: "Info found",
                        result: lastRes
                    })
                },1000)
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
            if (this.database) this.database.conection.query(proc,by,(err,result) => {
                if(err) rej({ message: err })
                if(!result || !result[0][0]) rej({
                    message: "Not found",
                    status: 404
                })
                setTimeout(() => {
                    res({
                        message: "Products found",
                        result: result
                    })
                },1000)
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
                if(err) rej({ message: err })
                if(!result || !result[0][0]) rej({
                    message: "Not found",
                    status: 404
                })
                setTimeout(() => {
                    res({
                        message: "Products found",
                        result: result[0]
                    })
                },1000)
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
                if(err) rej({ message: err })
                if(!result || !result[0][0]) rej({
                    message: "Not found",
                    status: 404
                })
                setTimeout(() => {
                    res({
                        message: "Products found",
                        result: result[0]
                    })
                },1000)
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
                if(err) rej({ message: err })
                if(!result || !result[0][0]) rej({
                    message: "Not found",
                    status: 404
                })
                setTimeout(() => {
                    res({
                        message: "Products found",
                        result: result[0]
                    })
                },1000)
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
                if(err) rej({ message: err })
                if(!result || !result[0][0]) rej({
                    message: "Not found",
                    status: 404
                })
                setTimeout(() => {
                    res({
                        message: "User found",
                        result: result
                    })
                },1000)
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
                if(err) rej({ message: err })
                if(!result || !result[0][0]) rej({
                    message: "Not found",
                    status: 404
                })
                setTimeout(() => {
                    res({
                        message: "Category found",
                        result: result[0]
                    })
                },1000)
            })

            // close conection 
            this.database.conection.end()
        })
    }
    
    // function to register
    async create(data) {
        return new Promise((res,rej) => {
            // data 
            const newUser = [
                data.nom,
                data.ape,
                data.fecNac,
                data.tdo,
                data.doc,
                data.dir,
                data.cel,
                data.cel2,
                data.email,
                data.hash_pass,
                data.gen
            ]
            let procedure = "CALL RegistProducts(?,?,?,?,?,?,?,?,?,?,?);"

            // conect to database
            this.database = new DataBase()
            this.database.conect()
            
            // verify conection and call procedure
            if (this.database) this.database.conection.query(procedure,newUser,err => { 
                if(err) rej(err) 
                setTimeout(() => res({
                    message: "User Created",
                    created: 1
                }),1000)
            })
            
            // close conection 
            this.database.conection.end()
        })
    }

    // function to modify
    async modify(data) {
        return new Promise((res,rej) => {
            // data 
            const newUser = [
                data.nom,
                data.ape,
                data.fecNac,
                data.tdo,
                data.doc,
                data.dir,
                data.cel,
                data.cel2,
                data.email,
                data.hash_pass,
                data.gen
            ]
            const procedure = "CALL ModifyProduct(?,?,?,?,?,?,?,?,?,?,?);"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(procedure,newUser,err => { 
                if(err) rej(err) 
                setTimeout(() => res({
                    message: "User Modify",
                    modified: 1,
                }),1000)
            })

            // close conection 
            this.database.conection.end()
        })
    }

    // function to delete
    async delete(data) {
        return new Promise((res,rej) => {
            // data 
            const procedure = "CALL DeleteProduct(?);"

            // conect to database
            const conection = conect()

            // verify conection and call procedure and call procedure
            if (conection) conection.query(procedure,data,err => { 
                if(err) rej(err) 
                setTimeout(() => res({
                    message: "User Deleted",
                    deleted: 1
                }),1000)
            })

            // close conection 
            conection.end()
        })
    }
}

// Export
module.exports = Product