// Librarys 
const mysql = require('mysql')
require('dotenv').config()

// Main Class
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

    // Function to close connection to BD everytime after a query
    closeConnection (){
        this.connection.end((err) =>{
            if (err){
                console.log('Error al desconectar a la base de datos',err)
                return
            }
            console.log('Desconexion exitosa')
        })
    }
}

// Exports 
module.exports = DataBase