// Librarys 
const mysql = require('mysql')
require('dotenv').config()

class DataBase {
    constructor() {
        this.conection = this.createConnection()
    }
    
    // Create conection function
    createConnection() {
        return mysql.createConnection({
            host: process.env.HOST_DB,
            database: process.env.NAME_DB,
            user: process.env.USER_DB,
            password:process.env.PASSWORD_DB,
            port: process.env.PORT_DB
        })
    }

    // Conect function
    conect = () => {
        this.conection.connect((err) => {
            if (err) {
                // throw Error(err)
                console.log(err)
                return null
            }
            return 1
        })
    }
}


// Exports 
module.exports = DataBase