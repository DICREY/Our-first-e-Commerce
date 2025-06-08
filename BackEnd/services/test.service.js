// Imports 
const DataBase = require('./DataBase.service')

class Test {
    constructor () {
        this.conection
    }

    async test () {
         return new Promise((res,rej) => {
            // vars
            const proc = "SELECT * FROM personas;"

            // conect to database
            this.database = new DataBase()
            this.database.conect()

            if (this.database) this.database.conection.query(proc,(err,result) => {
                if(err) rej({ message: err })
                if(!result || !result[0]) rej({
                    message: "Not found",
                    status: 404
                })
                setTimeout(() => {
                    res({
                        message: "Info found",
                        result: result,
                        found: 1
                    })
                },1000)
            })

            // close conection 
            this.database.conection.end()
        })
    }
}

module.exports = Test