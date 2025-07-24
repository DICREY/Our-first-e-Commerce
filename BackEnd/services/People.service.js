// Imports
const DataBase = require('./DataBase.service')

// Main class
class People {
    // constructor
    constructor(...args) {
        this.database = new DataBase()
        this.args = args
    }

    // function to find all
    async findAll() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL SearchPeoples();"

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
                            message: "People found",
                            result: result[0]
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }
    
    // function to find all by
    async findAllBy(data) {
        return new Promise((res,rej) => {
            // vars
            const by = data.replace(":","").replace(" ","")
            const proc = "CALL SearchPeoplesBy(?);"

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
                            message: "People found",
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
    async findBy() {
        return new Promise((res,rej) => {
            // vars
            const by = this.args[0]?.trim()
            const proc = "CALL SearchPeopleBy(?);"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,[by],(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "People found",
                            result: result[0]
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
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
            let procedure = "CALL RegistPeoples(?,?,?,?,?,?,?,?,?,?,?);"

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
                data.nom_per,
                data.nom2_per,
                data.ape_per,
                data.ape2_per,
                data.fec_nac_per,
                data.doc_per,
                data.dir_per,
                data.cel_per,
                data.cel2_per,
                data.email_per,
                data.gen_per,
                data.fot_per || 'No-registrado',
            ]
            const procedure = "CALL ModifyPeople(?,?,?,?,?,?,?,?,?,?,?,?);"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(procedure,newUser,err => { 
                if(err) rej(err) 
                setTimeout(() => res({
                    message: "User Modify",
                    success: 1,
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
            const procedure = "CALL DeletePeople(?);"

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
module.exports = People