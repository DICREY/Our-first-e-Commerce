// Imports 
const DataBase = require('./DataBase.service')

// Main Class
class Credentl {
    // constructor
    constructor(...args) {
        this.database = new DataBase()
        this.args = args
    }

    async login() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL Login(?);"
            const by = this.args[0].replace(" ","")

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
                            message: "Authorized",
                            result: result[0]
                        })
                    },1000)
                } else rej({ message: 'Error interno', status: 500 })
            })

            // close conection 
            this.database.conection.end()
        })
    }

    async ChangeTheme() {
        return new Promise((res,rej) => {
            // vars
            const proc = "CALL ChangeTheme(?,?);"
            const email = this.args[0].replace(" ","")
            const theme = this.args[1].replace(" ","")

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            // verify conection and call procedure
            if (this.database) this.database.conection.query(proc,[email,theme],(err,result) => {
                if(err) {
                    rej({ message: err })
                } else if (result) {
                    setTimeout(() => {
                        res({
                            message: "Theme changed",
                            success: 1,
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
module.exports = Credentl