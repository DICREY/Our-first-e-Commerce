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
                if(err) rej({ message: err }) 
                if(!result || !result[0][0]) rej({
                    message: "Not found",
                    status: 404
                })
                setTimeout(() => {
                    res({
                        message: "Authorized",
                        result: result
                    })
                },1000)
            })

            // close conection 
            this.database.conection.end()
        })
    }
}

// Export 
module.exports = Credentl