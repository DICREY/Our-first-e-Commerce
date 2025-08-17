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

    // Function to change rols
    async ChangeRoles() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL ChangeRoles(?,?,?);"
            const params = [
                this.args[0].isAdd,
                this.args[0].nom_rol,
                this.args[0].email_per
            ]

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,params,(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Authorized",
                            success: 1
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
                data.nom_per,
                data.nom2_per,
                data.ape_per,
                data.ape2_per,
                data.fec_nac_per,
                data.tip_doc_per,
                data.doc_per,
                data.dir_per,
                data.cel_per,
                data.cel2_per,
                data.email_per,
                data.hash_pass,
                data.gen_per,
                data.fot_per || 'No-registrado'
            ]
            let procedure = "CALL RegistPeoples(?,?,?,?,?,?,?,?,?,?,?,?,?,?);"

            // conect to database
            this.database = new DataBase()
            this.database.conect()
            
            // verify conection and call procedure
            if (this.database) this.database.conection.query(procedure,newUser,err => { 
                if(err) rej(err) 
                setTimeout(() => res({
                    message: "User Created",
                    success: 1
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
    async delete() {
        return new Promise((res,rej) => {
            // Vars
            const by = this.args[0]?.trim()
            const proc = "CALL DeletePeople(?);"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc, [by],(err) => {
                if(err) {
                    rej(err)
                } else setTimeout(() => res({
                    message: "User Deleted",
                    success: 1
                }),1000)
            })

            // close conection 
            this.database.conection.end()
        })
    }
}

// Export
module.exports = People